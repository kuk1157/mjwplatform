package com.pudding.base.domain.order.entity;

import com.pudding.base.domain.common.enums.IsOrderStatus;
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
@Table(name="orders") // order 테이블 (주문 테이블)
public class Order {

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

    @Column(name = "store_table_id")
    @Schema(description = "매장 테이블 고유번호")
    private Integer storeTableId;

    @Column(name = "user_id")
    @Schema(description = "고객 고유번호")
    private Integer userId;

    @Column(name = "store_name")
    @Schema(description = "매장 이름")
    private String storeName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Schema(description = "주문 상태")
    private IsOrderStatus status; // 'PENDING','COMPLETE'

    @Column(name = "price")
    @Schema(description = "주문 금액")
    private Integer price;

    @Column(name = "ordered_at")
    @Schema(description = "주문 완료일")
    private LocalDateTime orderedAt; // 점주가 포스기 입력하였을때 update

    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;


    @Builder
    public Order(Integer storeId, Integer ownerId, Integer storeTableId, Integer userId,
                 String storeName, IsOrderStatus status, Integer price) {
        this.storeId = storeId;
        this.ownerId = ownerId;
        this.storeTableId = storeTableId;
        this.userId = userId;
        this.storeName = storeName;
        this.status = status;
        this.price = price;
    }


    // 점주가 포스기 입력시점에 status(주문상태) update 하는 method
    public void updateOrderStatus(){
        this.status = IsOrderStatus.COMPLETE;
    }

    // 점주가 포스기 입력시점에 주문완료일 update 하는 method
    public void updateOrderedAt(){
        this.orderedAt = LocalDateTime.now();
    }


}
