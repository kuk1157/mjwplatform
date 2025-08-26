package com.pudding.base.dchain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
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

    @Value("${daeguchain.token}")
    private String appToken;

    @Value("${daeguchain.chain-id:dchain}")
    private String chainId;

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

    public Map<String, Object> mintNftForTest(
            String contractAddress,
            String receiver,
            String nftFileUri,
            String creator,
            OwnerKeyProvider keyProvider
    ) {
        try {
            String ownerPkey = keyProvider.getOwnerPrivateKeyFor(contractAddress);
            String hash = computeFileHashFromUrl(nftFileUri);

            Map<String, Object> payload = Map.of(
                    "token", appToken,
                    "chain", chainId,
                    "cont_addr", contractAddress,
                    "owner_addr", creator,   // Controller에서 전달한 ownerAddr 사용
                    "owner_pkey", ownerPkey,
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
            throw new RuntimeException("NFT minting failed: " + e.getMessage(), e);
        }
    }

    // URL에서 파일 읽어서 SHA256 해시 계산
    public String computeFileHashFromUrl(String fileUrl) throws Exception {
        try (InputStream in = new URL(fileUrl).openStream()) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) {
                digest.update(buffer, 0, read);
            }
            byte[] hashBytes = digest.digest();
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        }
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

    /**
     * 컬렉션 소유자 키 제공 인터페이스.
     * 실제 구현은 KMS/HSM 또는 서명 프록시를 사용하고,
     * 평문 키를 애플리케이션 메모리에 오래 두지 않도록 한다.
     */
    public interface OwnerKeyProvider {
        String getOwnerPrivateKeyFor(String contractAddress);
    }
}
