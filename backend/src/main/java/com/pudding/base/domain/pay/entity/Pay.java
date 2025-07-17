package com.pudding.base.domain.pay.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "pay") // pay 테이블 (결제 테이블)
public class Pay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Long id;

    @Column(name = "order_id")
    @Schema(description = "주문 고유번호")
    private Integer orderId;

    @Column(name = "store_id")
    @Schema(description = "매장 고유번호")
    private Integer storeId;

    @Column(name = "owner_id")
    @Schema(description = "점주 고유번호")
    private Integer ownerId;

    @Column(name = "user_id")
    @Schema(description = "고객 고유번호")
    private Integer userId;

    @Column(name = "amount")
    @Schema(description = "결제금액")
    private Integer amount;

    @Column(name = "discount_amount")
    @Schema(description = "할인금액(3%)")
    private Double discountAmount;

    @Column(name = "final_amount")
    @Schema(description = "최종 결제금액")
    private Integer finalAmount;

    @Column(name = "paid_at")
    @Schema(description = "결제 완료일")
    private LocalDateTime paidAt; // 결제가 최종 성공했을 경우(현재로는 서버 이슈, 세션이슈 등 그런상황 발생시엔 남으면안됨.)

    @Column(name = "created_at")
    @Schema(description = "생성일")
    private LocalDateTime createdAt;

    // 결제 완료일 업데이트
    private void updatePaidAt(){
        this.paidAt = LocalDateTime.now();
    }

    @Builder
    public Pay(Integer amount, Double discountAmount, Integer finalAmount){
        this.amount = amount;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
    }



}
