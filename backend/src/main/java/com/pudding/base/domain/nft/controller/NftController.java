package com.pudding.base.domain.nft.controller;

import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.nft.service.NftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "NFT 관련 API", description = "NFT 전체 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class NftController {
    private final NftService nftService;

    @Operation(summary = "NFT 등록 API", description = "NFT 발급 API")
    @PostMapping("/stores/{storeId}/customers/{customerId}/nfts")
    public ResponseEntity<NftDto> createNft(String did, String tokenHash, String mintHash, Integer storeTableId, Integer nftIdx, String nftUrl, Integer encId, @PathVariable Integer storeId, @PathVariable Integer customerId){
        NftDto savedNft = nftService.createNft(did, tokenHash, mintHash, storeTableId, nftIdx, nftUrl, encId, storeId, customerId);
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

    @Operation(summary = "NFT 상세보기", description = "NFT 상세 조회")
    @GetMapping("/nfts/{id}")
    public ResponseEntity<NftDto> getNftById(@PathVariable Integer id){
        NftDto nft = nftService.getNftById(id);
        return ResponseEntity.ok(nft);
    }
}
