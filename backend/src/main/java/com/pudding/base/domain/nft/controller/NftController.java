package com.pudding.base.domain.nft.controller;

import com.pudding.base.dchain.DaeguChainClient;
import com.pudding.base.dchain.MyOwnerKeyProvider;
import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.nft.service.NftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "NFT 관련 API", description = "NFT 전체 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class NftController {
    private final NftService nftService;
    private final DaeguChainClient daeguChainClient;
    private final MyOwnerKeyProvider ownerKeyProvider;

    @PostMapping("/nft/mint-test")
    public Map<String, Object> mintTest(@RequestBody Map<String, Object> req) throws Exception {
        // null-safe 처리
        String receiver = req.get("receiver") != null ? req.get("receiver").toString() : "";
        String nftFileUri = req.get("fileUri") != null ? req.get("fileUri").toString() : "";

        // receiver나 fileUri 비어있으면 예외 처리
        if (receiver.isEmpty() || nftFileUri.isEmpty()) {
            throw new IllegalArgumentException("receiver와 fileUri는 필수값입니다.");
        }

        // 테스트용 owner 주소 (백엔드에서 안전하게 고정)
        String ownerAddr = "0x68aD51947E2E4668B9Ee8efFe7f30de48510Eb32fca";

        return daeguChainClient.mintNftForTest(
                "0xD479753380a6de407a78c576CFb1D1B5278893e0fca", // 컨트랙트 주소
                receiver,
                nftFileUri, // hash 계산용 파일 경로
                ownerAddr,   // creator는 백엔드에서 결정
                ownerKeyProvider
        );
    }


    @Operation(summary = "NFT 등록 API", description = "NFT 발급 API")
    @PostMapping("/stores/{storeId}/customers/{customerId}/nfts")
    public ResponseEntity<NftDto> createNft(@RequestBody String did, @PathVariable Integer storeId, @PathVariable Integer customerId){
        NftDto savedNft = nftService.createNft(did, storeId, customerId);
        return ResponseEntity.ok(savedNft);
    }


    @Operation(summary = "NFT 전체 조회 API", description = "NFT 목록")
    @GetMapping("/customers/{customerId}/nfts")
    public ResponseEntity<List<NftDto>> getAllNft(@PathVariable Integer customerId,
                                                  @RequestParam(defaultValue = "desc") String sort,
                                                  @RequestParam(required = false) Integer limit){
        List<NftDto> nfts;
        if (limit == null) {
            nfts = nftService.getAllNftSorted(customerId, sort);
        } else {
            nfts = nftService.getLimitedNftSorted(customerId, sort, limit); // 최근 2개만 조회
        }
        return ResponseEntity.ok(nfts);
    }

    @Operation(summary ="NFT 고객,매장 기준으로 조회", description = "NFR 중복발급 예외 처리를 위한 API")
    @GetMapping("/customers/{customerId}/stores/{storeId}/nfts/check")
    public ResponseEntity<Boolean> checkNftExists(@PathVariable Integer storeId, @PathVariable Integer customerId){
        boolean exists = nftService.nftExists(storeId, customerId);
        return ResponseEntity.ok(exists);
    }


}
