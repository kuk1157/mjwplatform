package com.pudding.base.domain.visit.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.pudding.base.domain.common.enums.IsPaymentStatus;
import com.pudding.base.domain.common.enums.IsVisitStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@DynamicInsert
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="visit_log")
public class VisitLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "owner_id")
    @Schema(description = "점주 고유번호")
    private Integer ownerId;

    @Column(name = "store_id")
    @Schema(description = "매장 고유번호")
    private Integer storeId;

    @Column(name = "store_table_id")
    @Schema(description = "매장 테이블 고유번호")
    private Integer storeTableId;

    @Column(name = "customer_id")
    @Schema(description = "고객 고유번호")
    private Integer customerId;

    @Column(name = "store_name")
    @Schema(description = "매장 이름")
    private String storeName;

    @Enumerated(EnumType.STRING)
    @Column(name = "visit_status")
    @Schema(description = "방문상태(점주금액 입력일시)")
    private IsVisitStatus visitStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    @Schema(description = "하루 결제 상태(1일 결제 체크 같은고객이 하루 결제 된 기록이 있을 경우 그 날 일괄 데이터 y로 변경)")
    private IsPaymentStatus paymentStatus;

    @Column(name = "amount_entered_at", insertable = false, updatable = false)
    @Schema(description = "점주가 금액을 입력한 일시")
    private LocalDateTime amountEnteredAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;

    // 점주가 금액 입력시 - 방문 기록 상태 y로
    public void updateVisitStatus(){
        this.visitStatus = IsVisitStatus.y;
    }
//
//    // 점주가 금액 입력시 - 하루 결제 상태 y로
//    public void updatePaymentStatus(){
//        this.paymentStatus = IsPaymentStatus.y;
//    }

    // 점주가 금액 입력시 - 날짜 남도록
    public void updateAmountEnteredAt(){
        this.amountEnteredAt = LocalDateTime.now();
    }

    @Builder
    public VisitLog(Integer id, Integer ownerId, Integer storeId, Integer storeTableId, Integer customerId, String storeName, LocalDateTime createdAt){
        this.id = id;
        this.ownerId = ownerId;
        this.storeId = storeId;
        this.storeTableId = storeTableId;
        this.customerId = customerId;
        this.storeName = storeName;
        this.createdAt = createdAt;
    }

}
