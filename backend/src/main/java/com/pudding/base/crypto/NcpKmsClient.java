package com.pudding.base.crypto;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Component
public class NcpKmsClient {
    private final WebClient web;
    private final String baseUrl;
    private final String stage;
    private final String keyTag;
    private final String accessKey;
    private final String secretKey;
    private final String apiKey;

    public NcpKmsClient(WebClient.Builder builder,
                        org.springframework.core.env.Environment env) {
        this.baseUrl = env.getProperty("kms.base-url");
        this.stage = env.getProperty("kms.stage", "v2");
        this.keyTag = env.getProperty("kms.key-tag");
        this.accessKey = env.getProperty("kms.auth.access-key");
        this.secretKey = env.getProperty("kms.auth.secret-key");
        this.apiKey = env.getProperty("kms.auth.api-key", "");
        this.web = builder.baseUrl(baseUrl).build();
    }

    private String sign(String uri, long ts) throws Exception {
        // 공식 예제: "POST {uri}\n{timestamp}\n{apiKey?}\n{accessKey}" 를 HmacSHA256(secret) :contentReference[oaicite:7]{index=7}
        StringBuilder sb = new StringBuilder()
                .append("POST").append(" ").append(uri).append("\n")
                .append(ts).append("\n");
        if ("v1".equals(stage)) sb.append(apiKey).append("\n");
        sb.append(accessKey);
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return Base64.getEncoder().encodeToString(mac.doFinal(sb.toString().getBytes(StandardCharsets.UTF_8)));
    }

    private HttpHeaders headers(String uri) throws Exception {
        long ts = Instant.now().toEpochMilli();
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_JSON);
        h.add("x-ncp-apigw-timestamp", String.valueOf(ts));
        h.add("x-ncp-iam-access-key", accessKey);
        if ("v1".equals(stage)) {
            h.add("x-ncp-apigw-api-key", apiKey);
            h.add("x-ncp-apigw-signature-v1", sign(uri, ts));
        } else {
            h.add("x-ncp-apigw-signature-v2", sign(uri, ts));
        }
        return h;
    }

    private String path(String action) { // action: "createCustomKey" | "decrypt" | "reencrypt" | "encrypt"
        return "/keys/" + stage + "/" + keyTag + "/" + action;
    }

    /**
     * Create Custom Key: 래핑 DEK + (선택) 평문 DEK(base64) 반환
     */
    public Map<String, Object> createCustomKey(boolean requestPlainKey, Integer bits) throws Exception {
        String uri = path("createCustomKey"); // 공식 엔드포인트 :contentReference[oaicite:8]{index=8}
        var body = Map.of(
                "requestPlainKey", requestPlainKey,
                "bits", bits == null ? 256 : bits
        );
        return post(uri, body);
    }

    /**
     * Decrypt: wrapped DEK -> base64 plaintext
     */
    public Map<String, Object> decrypt(String wrappedDek) throws Exception {
        String uri = path("decrypt"); // :contentReference[oaicite:9]{index=9}
        var body = Map.of("ciphertext", wrappedDek);
        return post(uri, body);
    }

    /**
     * Re-encrypt: 같은 KeyTag 최신버전으로 재래핑
     */
    public Map<String, Object> reencrypt(String wrappedDek) throws Exception {
        String uri = path("reencrypt"); // :contentReference[oaicite:10]{index=10}
        var body = Map.of("ciphertext", wrappedDek);
        return post(uri, body);
    }

    /**
     * Encrypt: 새 KeyTag로 래핑할 때 사용(마이그레이션용). 여기선 같은 KeyTag 유지 시 보통 불필요
     */
    public Map<String, Object> encrypt(String plainB64) throws Exception {
        String uri = path("encrypt"); // :contentReference[oaicite:11]{index=11}
        var body = Map.of("plaintext", plainB64);
        return post(uri, body);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> post(String uri, Object body) throws Exception {
        return web.post().uri(uri)
                .headers(h -> {
                    try {
                        h.addAll(headers(uri));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String,Object>>() {})
                .block();
    }
}
