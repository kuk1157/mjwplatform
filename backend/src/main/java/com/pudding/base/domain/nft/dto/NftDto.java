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
    private String mintHash; // NFT 트랜잭션 내역 해쉬 값
    private Integer storeId;
    private Integer customerId;
    private Integer nftIdx;
    private Integer storeTableId;
    private String storeName; // 서브쿼리로 매장명 담을 필드
    private String nftImage; // 서브쿼리 NFT 이미지
    private String thumbnail; // 서브쿼리 썸네일
    private String extension; // 서브쿼리 확장자
    private LocalDateTime createdAt;


    @Builder
    public NftDto(Integer id, String tokenId, String mintHash, Integer storeId, Integer customerId, Integer nftIdx, Integer storeTableId, String storeName, String nftImage, String thumbnail, String extension, LocalDateTime createdAt) {
        this.id = id;
        this.tokenId = tokenId;
        this.mintHash = mintHash;
        this.storeId = storeId;
        this.customerId = customerId;
        this.nftIdx = nftIdx;
        this.storeTableId = storeTableId;
        this.storeName = storeName;
        this.nftImage = nftImage;
        this.thumbnail = thumbnail;
        this.extension = extension;
        this.createdAt = createdAt;
    }

    public static NftDto fromEntity(Nft nft){
        return NftDto.builder()
                .id(nft.getId())
                .tokenId(nft.getTokenId())
                .mintHash(nft.getMintHash())
                .storeId(nft.getStoreId())
                .customerId(nft.getCustomerId())
                .createdAt(nft.getCreatedAt())
                .build();
    }



}
