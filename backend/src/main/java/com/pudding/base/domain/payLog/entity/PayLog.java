package com.pudding.base.domain.payLog.entity;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@DynamicInsert // createdAt 생성일 insert,update 제외
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "pay_log") // pay_log 테이블 (결제내역 테이블)
public class PayLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "pay_id")
    @Schema(description = "결제 고유번호")
    private Integer payId;

    @Column(name = "pay_type")
    @Schema(description = "결제 타입")
    private String payType; // 추후 enum 으로 활용

    @Column(name = "amount")
    @Schema(description = "결제 금액")
    private Integer amount;

    @Column(name = "discount_amount")
    @Schema(description = "할인금액(3%)")
    private Double discountAmount;

    @Column(name = "final_amount")
    @Schema(description = "최종 결제금액")
    private Integer finalAmount;

    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;


    @Builder
    public PayLog(Integer payId, String payType, Integer amount, Double discountAmount, Integer finalAmount, LocalDateTime createdAt) {
        this.payId = payId;
        this.payType = payType;
        this.amount = amount;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
        this.createdAt = createdAt;
    }


}
