package com.pudding.base.domain.visit.dto;

import com.pudding.base.domain.visit.entity.VisitLog;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class VisitLogDto {
    private Integer id;
    private Integer ownerId;
    private Integer storeId;
    private Integer storeTableId;
    private Integer customerId;
    private String storeName;
    private String memberName; // 고객 이름(member테이블에서 가져오기)
    private LocalDateTime createdAt;


    @Builder
    public VisitLogDto(Integer id, Integer ownerId, Integer storeId, Integer storeTableId, Integer customerId, String storeName, String memberName, LocalDateTime createdAt){
        this.id = id;
        this.ownerId = ownerId;
        this.storeId = storeId;
        this.storeTableId = storeTableId;
        this.customerId = customerId;
        this.storeName = storeName;
        this.memberName = memberName;
        this.createdAt = createdAt;
    }

    public static VisitLogDto fromEntity(VisitLog visitLog){
        return VisitLogDto.builder()
                .id(visitLog.getId())
                .ownerId(visitLog.getOwnerId())
                .storeId(visitLog.getStoreId())
                .storeTableId(visitLog.getStoreTableId())
                .customerId(visitLog.getCustomerId())
                .storeName(visitLog.getStoreName())
                .createdAt(visitLog.getCreatedAt())
                .build();
    }


    @Getter
    @NoArgsConstructor
    public static class Request{
        private String did;
        public Request(String did){
            this.did = did;
        }
    }
}
