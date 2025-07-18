package com.pudding.base.domain.point.dto;


import com.pudding.base.domain.point.entity.Point;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class PointDto {
    private Integer id;
    private Integer payId;
    private Integer storeId;
    private Integer ownerId;
    private Integer orderPrice;
    private Double point;
    private LocalDateTime createdAt;


    @Builder
    public PointDto(Integer id, Integer payId, Integer storeId, Integer ownerId, Integer orderPrice, Double point, LocalDateTime createdAt){
        this.id = id;
        this.payId = payId;
        this.storeId = storeId;
        this.ownerId = ownerId;
        this.orderPrice = orderPrice;
        this.point = point;
        this.createdAt = createdAt;
    }


    public static PointDto fromEntity(Point point){
        return PointDto.builder()
                .id(point.getId())
                .payId(point.getPayId())
                .storeId(point.getStoreId())
                .ownerId(point.getOwnerId())
                .orderPrice(point.getOrderPrice())
                .point(point.getPoint())
                .createdAt(point.getCreatedAt())
                .build();
    }
}
