package com.pudding.base.domain.point.entity;


import com.pudding.base.domain.common.entity.BaseTimeEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDate;
import java.time.LocalDateTime;

@DynamicInsert // createdAt 생성일 insert,update 제외
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "point") // point 테이블(포인트 테이블)
public class Point extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "pay_id")
    @Schema(description = "결제 고유번호")
    private Integer payId;

    @Column(name = "store_id")
    @Schema(description = "매장 고유번호")
    private Integer storeId;

    @Column(name = "owner_id")
    @Schema(description = "점주 고유번호")
    private Integer ownerId;

    @Column(name = "order_price")
    @Schema(description = "주문 금액")
    private Integer orderPrice;

    @Column(name = "point")
    @Schema(description = "점주가 받을 포인트")
    private Double point;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;

    @Builder
    public Point(Integer id, Integer payId, Integer storeId, Integer ownerId, Integer orderPrice, Double point, LocalDateTime createdAt){
        this.id = id;
        this.payId = payId;
        this.storeId = storeId;
        this.ownerId = ownerId;
        this.orderPrice = orderPrice;
        this.point = point;
        this.createdAt = createdAt;
    }


    // 생성일 통계 검색용도
    @PrePersist
    public void prePersist() {// BaseTimeEntity의 createdAt 설정
        this.createdDate = LocalDate.now(); // 통계용 날짜
    }


    // 향후 개별 포인트에 대한 추적 (지급여부확인이 필요할때)을 위한 필드
//    @Column(name = "status")
//    @Schema(description = "지급 상태값")
//    private String status; // 추후 enum 으로 변경 예정(PENDING, PAID) & 포인트 현금화 신청 버튼 클릭시 업데이트
//
//    @Column(name = "point_at")
//    @Schema(description = "포인트 지급일")
//    private LocalDateTime pointAt; // 포인트 현금화 신청 버튼 클릭시 업데이트
//
//
//    // 지급 상태 PENDING => PAID로 업데이트
//    private void updatePointStatus(String status){
//        this.status = "PAID";
//    }
//
//    // 포인트 지급일 업데이트
//    private void updatePointAt(){
//        this.pointAt = LocalDateTime.now();
//    }

}
