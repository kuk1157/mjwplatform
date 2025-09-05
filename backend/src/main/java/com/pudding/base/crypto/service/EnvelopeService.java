package com.pudding.base.crypto.service;


import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;

@Service
@SuppressWarnings("unchecked")
public class EnvelopeService {
    private final NcpKmsClient kms;
    private final String keyTag;

    public EnvelopeService(NcpKmsClient kms, org.springframework.core.env.Environment env) {
        this.kms = kms;
        this.keyTag = env.getProperty("kms.key-tag");
    }

    public static class EncResult {
        public final String wrappedDek;
        public final String ivB64;
        public final int tagBits = 128;

        public EncResult(String wrappedDek, byte[] iv) {
            this.wrappedDek = wrappedDek;
            this.ivB64 = Base64.getEncoder().encodeToString(iv);
        }
    }

    /**
     * 업로드: 파일을 AES-256-GCM으로 스트리밍 암호화하고 DB 메타 반환
     */
    public EncResult encryptTo(OutputStream cipherOut, InputStream plainIn, String aad) throws Exception {
        // 1) DEK 생성 (권장: requestPlainKey=true 로 한번에 수신, 필요시 바로 zeroize)
        Map<String, Object> resp = kms.createCustomKey(true, 256); // :contentReference[oaicite:12]{index=12}
        String wrappedDek = (String) ((Map<String, Object>) resp.get("data")).get("ciphertext");
        String dekB64 = (String) ((Map<String, Object>) resp.get("data")).get("plaintext");
        byte[] dek = Base64.getDecoder().decode(dekB64);

        // 2) AES-GCM 암호화 (12B IV 권장)
        byte[] iv = new byte[12];
        new SecureRandom().nextBytes(iv);
        var key = new SecretKeySpec(dek, "AES");
        var cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, iv));
        if (aad != null && !aad.isBlank()) cipher.updateAAD(aad.getBytes(StandardCharsets.UTF_8));

        try (var cos = new CipherOutputStream(cipherOut, cipher)) {
            plainIn.transferTo(cos);
        } finally {
            java.util.Arrays.fill(dek, (byte) 0); // zeroize
        }
        return new EncResult(wrappedDek, iv);
    }

    /**
     * 다운로드: wrapped DEK 복호화 → 스트리밍 복호화
     */
    public void decryptTo(OutputStream plainOut, InputStream cipherIn,
                          String wrappedDek, String ivB64, String aad) throws Exception {
        Map<String, Object> resp = kms.decrypt(wrappedDek); // :contentReference[oaicite:13]{index=13}
        String dekB64 = (String) ((Map<String, Object>) resp.get("data")).get("plaintext");
        byte[] dek = Base64.getDecoder().decode(dekB64);

        try {
            var key = new SecretKeySpec(dek, "AES");
            var cipher = Cipher.getInstance("AES/GCM/NoPadding");
            byte[] iv = Base64.getDecoder().decode(ivB64);
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(128, iv));
            if (aad != null && !aad.isBlank()) cipher.updateAAD(aad.getBytes(StandardCharsets.UTF_8));
            try (var cis = new CipherInputStream(cipherIn, cipher)) {
                cis.transferTo(plainOut);
            }
        } finally {
            java.util.Arrays.fill(dek, (byte) 0);
        }
    }

    /**
     * 같은 KeyTag 최신버전으로 lazy 재래핑(회전 대응)
     */
    public String rewrapIfNeeded(String wrappedDek) throws Exception {
        Map<String, Object> resp = kms.reencrypt(wrappedDek); // 최신버전으로 재암호화 :contentReference[oaicite:14]{index=14}
        String newWrapped = (String) ((Map<String, Object>) resp.get("data")).get("ciphertext");
        if (newWrapped != null && !newWrapped.equals(wrappedDek)) return newWrapped;
        return wrappedDek; // 변화 없으면 그대로
    }

}