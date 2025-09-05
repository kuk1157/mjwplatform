package com.pudding.base.crypto.service;

import com.pudding.base.crypto.exception.EncMetaException;
import com.pudding.base.crypto.model.EnvelopeMeta;     // 런타임
import com.pudding.base.crypto.entity.EncMetaEntity;   // DB
import com.pudding.base.crypto.repository.EncMetaRepository;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class EncMetaManager {

    private final FileCrypto fileCrypto;
    private final EncMetaRepository repo;

    @Getter
    @AllArgsConstructor
    public static class EncryptResult {
        private final int id;
        private final String cipherSha256;
        private final byte[] cipher;
        private final Instant createdAt;
    }

    private static String sha256Hex(byte[] b) {
        try {
            var md = MessageDigest.getInstance("SHA-256");
            byte[] d = md.digest(b);
            StringBuilder sb = new StringBuilder(d.length * 2);
            for (byte x : d) sb.append(String.format("%02x", x));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static String sha256Hex(String s) {
        return sha256Hex(s.getBytes(StandardCharsets.UTF_8));
    }


    private static String buildAad(Instant createdAt) {
        return "ts=%s;v=1".formatted(createdAt.toString());
    }

    @Transactional
    public EncryptResult encryptBytes(byte[] plain) throws Exception {
        Instant now = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        String aad = buildAad(now);

        var out = fileCrypto.encryptBytes(plain, aad);
        EnvelopeMeta meta = out.getMeta();
        byte[] cipher = out.getCiphertext();

        var row = EncMetaEntity.builder()
                .cipherSha256(sha256Hex(cipher))
                .algo(meta.getAlgo())
                .ivB64(meta.getIvB64())
                .tagBits(meta.getTagBits())
                .wrappedDek(meta.getWrappedDek())
                .aadHash(sha256Hex(aad))
                .createdAt(now)
                .wrappedAt(meta.getWrappedAt())
                .build();
        repo.save(row);

        return new EncryptResult(row.getId(), row.getCipherSha256(), cipher, row.getCreatedAt());
    }

    @Transactional
    public byte[] decryptBytes(int id, byte[] encFromChain) {
        var row = repo.findById(id).orElseThrow(() -> EncMetaException.notFound(id));

        if (!sha256Hex(encFromChain).equalsIgnoreCase(row.getCipherSha256()))
            throw EncMetaException.cipherMismatch();

        String aad = buildAad(row.getCreatedAt());

        EnvelopeMeta meta = EnvelopeMeta.builder()
                .algo(row.getAlgo())
                .ivB64(row.getIvB64())
                .tagBits(row.getTagBits())
                .wrappedDek(row.getWrappedDek())
                .aad(aad)
                .createdAt(row.getCreatedAt())
                .wrappedAt(row.getWrappedAt())
                .build();

        try {
            if (fileCrypto.rewrapIfNeeded(meta)) {
                row.setWrappedDek(meta.getWrappedDek());
                row.setWrappedAt(meta.getWrappedAt());
                repo.save(row);
            }
            return fileCrypto.decryptBytes(encFromChain, meta);
        } catch (Exception e) {
            throw EncMetaException.kms(e.getMessage(), e);
        }
    }

    @Transactional
    public int rewrapAll() {
        int updated = 0;
        for (var row : repo.findAll()) {
            EnvelopeMeta meta = EnvelopeMeta.builder()
                    .algo(row.getAlgo())
                    .ivB64(row.getIvB64())
                    .tagBits(row.getTagBits())
                    .wrappedDek(row.getWrappedDek())
                    .aad("dummy")
                    .createdAt(row.getCreatedAt())
                    .wrappedAt(row.getWrappedAt())
                    .build();
            try {
                if (fileCrypto.rewrapIfNeeded(meta)) {
                    row.setWrappedDek(meta.getWrappedDek());
                    row.setWrappedAt(meta.getWrappedAt());
                    repo.save(row);
                    updated++;
                }
            } catch (Exception e) {
                throw EncMetaException.kms(e.getMessage(), e);
            }
        }
        return updated;
    }
}
