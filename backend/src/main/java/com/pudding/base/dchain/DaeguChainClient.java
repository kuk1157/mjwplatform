package com.pudding.base.dchain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pudding.base.dchain.dto.DaeguChainNftMetadataDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Map;

/**
 * 대구체인 BaaS 클라이언트.
 * - 계정 생성: /v2/mitum/com/acc_create
 * - NFT 민팅 : /v2/mitum/nft721/mint
 *
 * 주의:
 *  - 개인키 평문은 보관/로그 금지.
 *  - owner_pkey는 KMS/HSM 등에서 관리하고, 여기엔 주입만 받거나 서명 서비스로 대체할 것.
 */
@Component
@RequiredArgsConstructor
public class DaeguChainClient {

    private final WebClient daeguWebClient;
    private final ObjectMapper objectMapper;

    @Value("${daeguchain.token}")
    private String appToken;

    @Value("${daeguchain.chain-id:dchain}")
    private String chainId;

    @Value("${daeguchain.privateKey}")
    private String ownerPrivateKey;


    // ===== 계정(지갑) 생성 =====
    public String createAccountAddress() {
        var req = Map.of("token", appToken, "chain", chainId);

        AccCreateResponse res = daeguWebClient.post()
                .uri("/v2/mitum/com/acc_create")
                .bodyValue(req)
                .retrieve()
                .onStatus(s -> s.value() >= 400, r ->
                    r.bodyToMono(String.class)
                     .defaultIfEmpty("")
                     .map(msg -> new DaeguChainException("acc_create failed: " + r.statusCode() + " - " + msg))
                )
                .bodyToMono(AccCreateResponse.class)
                // acc_create는 멱등성이 높아 백오프 재시도 허용
                .retryWhen(Retry.backoff(2, Duration.ofMillis(300)))
                .block();

        if (res == null || res.data == null || res.data.keyPair == null) {
            throw new DaeguChainException("acc_create empty response");
        }
        String address = res.data.keyPair.address;
        if (address == null || address.isBlank()) {
            throw new DaeguChainException("acc_create missing address");
        }
        // privatekey/publickey는 사용하지 않음
        return address;
    }
    // ===== DTOs =====
    @Data
    static class AccCreateResponse { private AccCreateData data; }

    @Data
    static class AccCreateData { @JsonProperty("key_pair") private KeyPair keyPair; }

    @Data
    static class KeyPair {
        private String address;
        @JsonProperty("privatekey") private String privateKey; // 사용 금지
        @JsonProperty("publickey")  private String publicKey;  // 사용 금지
    }

    @AllArgsConstructor
    public static class DaeguChainException extends RuntimeException {
        public DaeguChainException(String message) { super(message); }
    }


    // NFT 파일업로드를 위한 Metadata json 세팅 메서드
    public String createMetadataJson(DaeguChainNftMetadataDto dto) throws Exception {
        return objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(dto);
    }

    // NFT 파일 업로드 API
    public Map<String, String> uploadNftJson(String jsonContent, String description, String filename) {
        File tempFile;
        try {
            tempFile = File.createTempFile("metadata_", ".json");
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(jsonContent.getBytes(StandardCharsets.UTF_8));
            }
            System.out.println("임시파일 생성: " + tempFile.getAbsolutePath());
        } catch (Exception e) {
            throw new RuntimeException("임시 JSON 파일 생성 실패", e);
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost uploadPost = new HttpPost("https://www.daegu.go.kr/daeguchain/v2/mitum/upload/upload_nft");

            // MultipartEntity 생성
            HttpEntity multipart = MultipartEntityBuilder.create()
                    .addTextBody("token", appToken)
                    .addBinaryBody("nft_file", tempFile, ContentType.APPLICATION_JSON, filename)
                    .addTextBody("description", description)
                    .build();

            uploadPost.setEntity(multipart);

//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            multipart.writeTo(baos);
//            System.out.println("=== 실제 전송 바디 ===\n" + baos.toString(StandardCharsets.UTF_8));

            // 요청 실행
            return httpClient.execute(uploadPost, response -> {
                int status = response.getCode();
                String body = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
                if (status >= 200 && status < 300) {
                    JsonNode root = objectMapper.readTree(body);
                    String uri = root.path("data").path("uri").asText();
                    String fileHash = root.path("data").path("file_hash").asText();
                    return Map.of(
                            "uri", uri,
                            "fileHash", fileHash
                    );
                } else {
                    throw new RuntimeException(" Status: " + status + ", body: " + body);
                }
            });

        } catch (Exception e) {
            throw new RuntimeException("NFT file upload 실패", e);
        } finally {
            // 임시 파일 삭제
            tempFile.delete();
        }
    }

    // NFT Mint API 메타데이터, 파일 URL 등 많은 정보를 다대구 로그인 시 받아서 진행
    public Map<String, Object> nftMint(
            String contractAddress,
            String receiver,
            String nftFileUri,
            String creator,
            String hash
    ) {
        try {

            Map<String, Object> payload = Map.of(
                    "token", appToken,
                    "chain", chainId,
                    "cont_addr", contractAddress,
                    "owner_addr", creator,   // Controller에서 전달한 ownerAddr 사용
                    "owner_pkey", ownerPrivateKey,
                    "receiver", receiver,
                    "uri", nftFileUri,
                    "hash", hash,
                    "creator", creator
            );

            return daeguWebClient.post()
                    .uri("/v2/mitum/nft/mint")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

        } catch (Exception e) {
            throw new RuntimeException("NFT Mint 실패: " + e.getMessage(), e);
        }
    }

    // nftIdx 추출 하기
    public Map<String, Object> nftIdx(
            String contractAddress,
            String factHash
    ) {
        try {

            Map<String, Object> payload = Map.of(
                    "token", appToken,
                    "chain", chainId,
                    "cont_addr", contractAddress,
                    "fact_hash", factHash
            );

            return daeguWebClient.post()
                    .uri("/v2/mitum/nft/nft_idx")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

        } catch (Exception e) {
            throw new RuntimeException("NFT ID 추출 실패: " + e.getMessage(), e);
        }
    }







    /**
     * 컬렉션 소유자 키 제공 인터페이스.
     * 실제 구현은 KMS/HSM 또는 서명 프록시를 사용하고,
     * 평문 키를 애플리케이션 메모리에 오래 두지 않도록 한다.
     */
    public interface OwnerKeyProvider {
        String getOwnerPrivateKeyFor(String contractAddress);
    }
}
