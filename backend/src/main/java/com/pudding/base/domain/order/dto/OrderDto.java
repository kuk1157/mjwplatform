package com.pudding.base.domain.order.dto;


import com.pudding.base.domain.common.enums.IsOrderStatus;
import com.pudding.base.domain.order.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderDto {
    private Integer id;
    private Integer storeId;
    private Integer ownerId;
    private Integer storeTableId;
    private Integer userId;
    private String storeName;
    private IsOrderStatus status;
    private Integer price;
    private LocalDateTime orderedAt;
    private LocalDateTime createdAt;

    @Builder
    public OrderDto(Integer id, Integer storeId, Integer ownerId, Integer storeTableId, Integer userId, String storeName, IsOrderStatus status, Integer price, LocalDateTime orderedAt, LocalDateTime createdAt){
        this.id = id;
        this.storeId = storeId;
        this.ownerId = ownerId;
        this.storeTableId = storeTableId;
        this.userId = userId;
        this.storeName = storeName;
        this.status = status;
        this.price = price;
        this.orderedAt = orderedAt;
        this.createdAt = createdAt;
    }

    public static OrderDto fromEntity(Order order){
        return OrderDto.builder()
                .id(order.getId())
                .storeId(order.getStoreId())
                .ownerId(order.getOwnerId())
                .storeTableId(order.getStoreTableId())
                .userId(order.getUserId())
                .storeName(order.getStoreName())
                .price(order.getPrice())
                .build();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Request{
        @NotNull(message = "주문 금액을 입력해주세요.")
        private Integer price;

        public Request(Integer price){
            this.price = price;
        }
    }







}
