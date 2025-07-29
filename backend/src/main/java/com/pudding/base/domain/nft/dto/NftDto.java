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
    private String storeName; // 서브쿼리로 매장명 담을 필드
    private LocalDateTime createdAt;


    @Builder
    public NftDto(Integer id, String tokenId, Integer storeId, Integer customerId, String storeName, LocalDateTime createdAt) {
        this.id = id;
        this.tokenId = tokenId;
        this.storeId = storeId;
        this.customerId = customerId;
        this.storeName = storeName;
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
