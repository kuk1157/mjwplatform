package com.pudding.base.domain.payLog.dto;

import com.pudding.base.domain.payLog.entity.PayLog;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class PayLogDto {
    private Integer id;
    private Integer payId;
    private String payType;
    private Integer amount;
    private Double discountAmount;
    private Integer finalAmount;
    private LocalDateTime createdAt;

    @Builder
    public PayLogDto(Integer id, Integer payId, String payType, Integer amount, Double discountAmount, Integer finalAmount, LocalDateTime createdAt){
        this.id = id;
        this.payId = payId;
        this.payType = payType;
        this.amount = amount;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
        this.createdAt = createdAt;
    }

    public static PayLogDto fromEntity(PayLog payLog){
        return PayLogDto.builder()
                .id(payLog.getId())
                .payId(payLog.getPayId())
                .payType(payLog.getPayType())
                .amount(payLog.getAmount())
                .discountAmount(payLog.getDiscountAmount())
                .finalAmount(payLog.getFinalAmount())
                .createdAt(payLog.getCreatedAt())
                .build();
    }
}
