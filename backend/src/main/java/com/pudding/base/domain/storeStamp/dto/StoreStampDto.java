package com.pudding.base.domain.storeStamp.dto;

import com.pudding.base.domain.storeStamp.entity.StoreStamp;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class StoreStampDto {
    private Integer id;
    private Integer storeId;
    private Integer customerId;
    private LocalDateTime createdAt;

    @Builder
    public StoreStampDto(Integer id, Integer storeId, Integer customerId, LocalDateTime createdAt){
        this.id = id;
        this.storeId = storeId;
        this.customerId = customerId;
        this.createdAt = createdAt;
    }

    public static StoreStampDto fromEntity(StoreStamp storeStamp){
        return StoreStampDto.builder()
                .id(storeStamp.getId())
                .storeId(storeStamp.getStoreId())
                .customerId(storeStamp.getCustomerId())
                .createdAt(storeStamp.getCreatedAt())
                .build();
    }
}
