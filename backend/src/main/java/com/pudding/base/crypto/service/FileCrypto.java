package com.pudding.base.crypto.service;

import com.pudding.base.crypto.model.EnvelopeMeta;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.Instant;

/**
 * 'KMS 봉투암호화 + AES-GCM'
 * - 저장(S3, DB 등), 전송(HTTP 응답)은 호출자가 담당.
 * - AAD는 호출자가 안정적인 식별자(docId 등)로 만들어 넘길 것.
 */
@Service
@RequiredArgsConstructor
public class FileCrypto {
    private final EnvelopeService envelope;

    @Value("${kms.key-tag}")
    private String kmsKeyTag; // 감사용 기록

    // ===== 결과 래퍼 =====
    @Getter
    @AllArgsConstructor
    public static class EncryptOutput {
        private final byte[] ciphertext;
        private final EnvelopeMeta meta;
    }

    // ===== BYTES API =====

    /**
     * 평문 바이트 → 암호문 바이트 + 메타 반환
     */
    public EncryptOutput encryptBytes(byte[] plaintext, String aad) throws Exception {
        try (var in = new ByteArrayInputStream(plaintext);
             var out = new ByteArrayOutputStream()) {
            var res = envelope.encryptTo(out, in, aad);
            var meta = EnvelopeMeta.builder()
                    .ivB64(res.ivB64)
                    .wrappedDek(res.wrappedDek)
                    .aad(aad)
                    //.keyTag(kmsKeyTag)
                    .build();
            return new EncryptOutput(out.toByteArray(), meta);
        }
    }

    /**
     * 암호문 바이트 → 평문 바이트 (메타 필수)
     */
    public byte[] decryptBytes(byte[] ciphertext, EnvelopeMeta meta) throws Exception {
        try (var in = new ByteArrayInputStream(ciphertext);
             var out = new ByteArrayOutputStream()) {
            envelope.decryptTo(out, in, meta.getWrappedDek(), meta.getIvB64(), meta.getAad());
            return out.toByteArray();
        }
    }

    // ===== STREAM API =====

    /**
     * 평문 스트림 → 암호문을 out으로 스트리밍, 메타 반환
     */
    public EnvelopeMeta encryptTo(OutputStream cipherOut, InputStream plainIn, String aad) throws Exception {
        var res = envelope.encryptTo(cipherOut, plainIn, aad); // 내부 스트리밍
        var meta = EnvelopeMeta.builder()
                .ivB64(res.ivB64)
                .wrappedDek(res.wrappedDek)
                .aad(aad)
                //.keyTag(kmsKeyTag)
                .build();
        return meta;
    }

    /**
     * 암호문 스트림 → 평문을 out으로 스트리밍 (메타 필수)
     */
    public void decryptTo(OutputStream plainOut, InputStream cipherIn, EnvelopeMeta meta) throws Exception {
        envelope.decryptTo(plainOut, cipherIn, meta.getWrappedDek(), meta.getIvB64(), meta.getAad());
    }

    // ===== 회전 대응(같은 KeyTag) =====

    /**
     * 같은 KeyTag 최신버전으로 재래핑(lazy). 변경 시 meta 갱신 및 true 반환
     */
    public boolean rewrapIfNeeded(EnvelopeMeta meta) throws Exception {
        String newWrapped = envelope.rewrapIfNeeded(meta.getWrappedDek());
        if (!newWrapped.equals(meta.getWrappedDek())) {
            meta.setWrappedDek(newWrapped);
            meta.setWrappedAt(Instant.now());
            return true;
        }
        return false;
    }

    // ===== AAD 헬퍼 =====

    /**
     * 기본 AAD 포맷. 저장 경로가 바뀌어도 불변인 값(docId 등) 위주
     */
    public String defaultAad(String contentId, String ownerId, String purpose) {
        return "cid=%s;owner=%s;purpose=%s".formatted(contentId, ownerId, purpose);
    }
}
