package com.pudding.base.domain.nft.dto;

import com.pudding.base.domain.nft.entity.Nft;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class NftDto {
    private Integer id;
    private String tokenId;
    private Integer storeId;
    private Integer customerId;
    private Integer nftIdx;
    private Integer storeTableId;
    private String storeName; // 서브쿼리로 매장명 담을 필드
    private String nftImage; // 서브쿼리 NFT 이미지
    private LocalDateTime createdAt;


    @Builder
    public NftDto(Integer id, String tokenId, Integer storeId, Integer customerId, Integer nftIdx, Integer storeTableId, String storeName, String nftImage, LocalDateTime createdAt) {
        this.id = id;
        this.tokenId = tokenId;
        this.storeId = storeId;
        this.customerId = customerId;
        this.nftIdx = nftIdx;
        this.storeTableId = storeTableId;
        this.storeName = storeName;
        this.nftImage = nftImage;
        this.createdAt = createdAt;
    }

    public static NftDto fromEntity(Nft nft){
        return NftDto.builder()
                .id(nft.getId())
                .tokenId(nft.getTokenId())
                .storeId(nft.getStoreId())
                .customerId(nft.getCustomerId())
                .createdAt(nft.getCreatedAt())
                .build();
    }



}
