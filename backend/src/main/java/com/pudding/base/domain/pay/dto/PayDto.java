package com.pudding.base.domain.pay.dto;
import com.pudding.base.domain.pay.entity.Pay;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
public class PayDto {

    private Long id;
    private Integer orderId;
    private Integer storeId;
    private Integer ownerId;
    private Integer userId;
    private Integer totalAmount;
    private Integer discountAmount;
    private Integer finalAmount;
    private LocalDateTime paidAt;

    @Builder
    public PayDto(Long id, Integer orderId, Integer storeId, Integer ownerId, Integer userId, Integer totalAmount, Integer discountAmount, Integer finalAmount){
        this.id = id;
        this.orderId = orderId;
        this.storeId = storeId;
        this.ownerId = ownerId;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
    }

    public static PayDto fromEntity(Pay pay) {
        return PayDto.builder()
                .id(pay.getId())
                .orderId(pay.getOrderId())
                .storeId(pay.getStoreId())
                .ownerId(pay.getOwnerId())
                .userId(pay.getUserId())
                .totalAmount(pay.getTotalAmount())
                .discountAmount(pay.getDiscountAmount())
                .finalAmount(pay.getFinalAmount())
                .build();
    }

}
