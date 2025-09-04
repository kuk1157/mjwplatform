package com.pudding.base.crypto;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

public class CryptoEnvelopeUtil {

    private static final ObjectMapper OM = new ObjectMapper().findAndRegisterModules();

    /**
     * 헤더 = { v, iv, dek, tag, aad } 를 JSON으로 넣고, 앞에 8바이트(헤더 길이) 프리픽스
     */
    public static void write(Path out, byte[] ciphertext, EncryptedMeta meta) throws IOException {
        Map<String, Object> header = Map.of(
                "v", 1,
                "iv", meta.getIvB64(),
                "dek", meta.getWrappedDek(),
                "tag", meta.getTagBits(),
                "aad", meta.getAad()
        );
        byte[] h = OM.writeValueAsBytes(header);
        byte[] len = ByteBuffer.allocate(8).order(ByteOrder.BIG_ENDIAN).putLong(h.length).array();

        try (OutputStream os = Files.newOutputStream(out)) {
            os.write(len);
            os.write(h);
            os.write(ciphertext);
        }
    }

    /**
     * 단일 파일에서 메타+암호문을 읽어 분리
     */
    public static ReadResult read(Path in) throws IOException {
        try (InputStream is = Files.newInputStream(in)) {
            byte[] len = is.readNBytes(8);
            long headerLen = ByteBuffer.wrap(len).order(ByteOrder.BIG_ENDIAN).getLong();
            if (headerLen <= 0 || headerLen > 1_000_000) throw new IOException("invalid header length");

            byte[] h = is.readNBytes((int) headerLen);
            @SuppressWarnings("unchecked")
            Map<String, Object> header = OM.readValue(h, Map.class);

            String iv = (String) header.get("iv");
            String dek = (String) header.get("dek");
            Integer tag = (Integer) header.get("tag");
            String aad = (String) header.get("aad");

            byte[] cipher = is.readAllBytes();

            EncryptedMeta meta = EncryptedMeta.builder()
                    .ivB64(iv)
                    .wrappedDek(dek)
                    .tagBits(tag == null ? 128 : tag)
                    .aad(aad)
                    .build();

            return new ReadResult(cipher, meta);
        }
    }

    public record ReadResult(byte[] ciphertext, EncryptedMeta meta) {
    }
}
