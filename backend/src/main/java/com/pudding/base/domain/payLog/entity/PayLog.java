package com.pudding.base.domain.payLog.entity;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "pay_log") // pay_log 테이블 (결제내역 테이블)
public class PayLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Long id;

    @Column(name = "pay_id")
    @Schema(description = "결제 고유번호")
    private Integer payId;

    @Column(name = "pay_type")
    @Schema(description = "결제 타입")
    private String payType; // 추후 enum 으로 활용

    @Column(name = "pay_amount")
    @Schema(description = "결제 금액")
    private Integer payAmount;

    @Column(name = "created_at")
    @Schema(description = "생성일")
    private LocalDateTime createdAt;
}
