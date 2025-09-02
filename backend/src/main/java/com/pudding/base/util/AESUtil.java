package com.pudding.base.util;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.security.SecureRandom;

public class AESUtil {
    private static final String ALGORITHM = "AES";
    private static final int KEY_SIZE = 256;
    private static final int IV_SIZE = 12; // GCM 추천 12byte
    private static final int TAG_BIT_LENGTH = 128;

    // 암호화
    public static String encrypt(String plainText, byte[] secretKey) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(secretKey, "AES"); // byte[] 그대로

        byte[] iv = new byte[IV_SIZE];
        new SecureRandom().nextBytes(iv);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(TAG_BIT_LENGTH, iv);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, spec);

        byte[] encrypted = cipher.doFinal(plainText.getBytes());

        // IV + 암호문을 합쳐서 Base64로 반환
        byte[] encryptedIvAndText = new byte[iv.length + encrypted.length];
        System.arraycopy(iv, 0, encryptedIvAndText, 0, iv.length);
        System.arraycopy(encrypted, 0, encryptedIvAndText, iv.length, encrypted.length);

        return Base64.getEncoder().encodeToString(encryptedIvAndText);
    }

    // 복호화
    public static String decrypt(String encryptedText, byte[] secretKey) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(secretKey, "AES"); // byte[] 그대로

        // Base64 decode
        byte[] decoded = Base64.getDecoder().decode(encryptedText);

        // IV 분리
        byte[] iv = new byte[IV_SIZE];
        System.arraycopy(decoded, 0, iv, 0, iv.length);

        // 실제 암호문 분리
        byte[] cipherText = new byte[decoded.length - IV_SIZE];
        System.arraycopy(decoded, IV_SIZE, cipherText, 0, cipherText.length);

        // 복호화
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(TAG_BIT_LENGTH, iv);
        cipher.init(Cipher.DECRYPT_MODE, keySpec, spec);

        byte[] plain = cipher.doFinal(cipherText);
        return new String(plain);
    }

}
