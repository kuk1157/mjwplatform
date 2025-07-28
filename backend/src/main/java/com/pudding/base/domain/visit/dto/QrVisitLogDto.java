package com.pudding.base.domain.visit.dto;

import com.pudding.base.domain.visit.entity.QrVisitLog;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class QrVisitLogDto {
    private Integer id;
    private Integer ownerId;
    private Integer storeId;
    private Integer storeTableId;
    private Integer customerId;
    private String storeName;
    private LocalDateTime createdAt;


    @Builder
    public QrVisitLogDto(Integer id, Integer ownerId, Integer storeId, Integer storeTableId, Integer customerId, String storeName, LocalDateTime createdAt){
        this.id = id;
        this.ownerId = ownerId;
        this.storeId = storeId;
        this.storeTableId = storeTableId;
        this.customerId = customerId;
        this.storeName = storeName;
        this.createdAt = createdAt;
    }

    public static QrVisitLogDto fromEntity(QrVisitLog qrVisitLog){
        return QrVisitLogDto.builder()
                .id(qrVisitLog.getId())
                .ownerId(qrVisitLog.getOwnerId())
                .storeId(qrVisitLog.getStoreId())
                .storeTableId(qrVisitLog.getStoreTableId())
                .customerId(qrVisitLog.getCustomerId())
                .storeName(qrVisitLog.getStoreName())
                .createdAt(qrVisitLog.getCreatedAt())
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
