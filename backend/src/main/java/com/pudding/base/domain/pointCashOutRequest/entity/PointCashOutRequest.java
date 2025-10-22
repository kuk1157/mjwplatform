package com.pudding.base.domain.pointCashOutRequest.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "point_cash_out_request") // 포인트 현금화 신청 기록 테이블
public class PointCashOutRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "store_id")
    @Schema(description = "매장 고유번호")
    private Integer storeId;

    @Column(name = "owner_id")
    @Schema(description = "점주 고유번호")
    private Integer ownerId;

    @Column(name = "cash")
    @Schema(description = "실제현금")
    private Integer cash;

    @Column(name = "request_at")
    @Schema(description = "현금화 신청일")
    private LocalDateTime requestAt;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Builder
    public PointCashOutRequest(Integer id, Integer storeId, Integer ownerId, Integer cash, LocalDateTime requestAt){
        this.id = id;
        this.storeId = storeId;
        this.ownerId = ownerId;
        this.cash = cash;
        this.requestAt = requestAt;
    }

    // 생성일 통계 검색용도
    @PrePersist
    public void prePersist() {// BaseTimeEntity의 createdAt 설정
        this.createdDate = LocalDate.now(); // 통계용 날짜
    }

}
