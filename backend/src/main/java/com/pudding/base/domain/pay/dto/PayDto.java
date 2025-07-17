package com.pudding.base.domain.pay.dto;
import com.pudding.base.domain.pay.entity.Pay;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Getter
public class PayDto {

    private Long id;
    private Integer orderId;
    private Integer storeId;
    private Integer ownerId;
    private Integer userId;
    private Integer amount;
    private Double discountAmount;
    private Integer finalAmount;
    private LocalDateTime paidAt;

    @Builder
    public PayDto(Long id, Integer orderId, Integer storeId, Integer ownerId, Integer userId, Integer amount, Double discountAmount, Integer finalAmount){
        this.id = id;
        this.orderId = orderId;
        this.storeId = storeId;
        this.ownerId = ownerId;
        this.userId = userId;
        this.amount = amount;
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
                .amount(pay.getAmount())
                .discountAmount(pay.getDiscountAmount())
                .finalAmount(pay.getFinalAmount())
                .build();
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Request{
        @NotNull(message = "주문 금액을 입력해주세요.")
        private Integer amount;

        public Request(Integer amount){
            this.amount = amount;
        }
    }
}
