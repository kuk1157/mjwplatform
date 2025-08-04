package com.pudding.base.domain.pay.dto;
import com.pudding.base.domain.pay.entity.Pay;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PayDto {

    private Integer id;
    private Integer visitLogId;
    private Integer storeId;
    private Integer ownerId;
    private Integer customerId;
    private Integer amount;
    private Double discountAmount;
    private Integer finalAmount;
    private LocalDateTime paidAt;

    @Builder
    public PayDto(Integer id, Integer visitLogId, Integer storeId, Integer ownerId, Integer customerId, Integer amount, Double discountAmount, Integer finalAmount){
        this.id = id;
        this.visitLogId = visitLogId;
        this.storeId = storeId;
        this.ownerId = ownerId;
        this.customerId = customerId;
        this.amount = amount;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
    }

    public static PayDto fromEntity(Pay pay) {
        return PayDto.builder()
                .id(pay.getId())
                .visitLogId(pay.getVisitLogId())
                .storeId(pay.getStoreId())
                .ownerId(pay.getOwnerId())
                .customerId(pay.getCustomerId())
                .amount(pay.getAmount())
                .discountAmount(pay.getDiscountAmount())
                .finalAmount(pay.getFinalAmount())
                .build();
    }

    @Getter
    @NoArgsConstructor
    public static class Request{
        @NotNull(message = "주문 금액을 입력해주세요.")
        private Integer amount;

        public Request(Integer amount){
            this.amount = amount;
        }
    }
}
