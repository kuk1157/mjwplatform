package com.pudding.base.domain.order.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Table(name="order") // order 테이블 (주문 테이블)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Long id;

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

    @Column(name = "status")
    @Schema(description = "주문 상태")
    private String status; // enum 세팅 후에 enum 으로 변경

    @Column(name = "price")
    @Schema(description = "주문 금액")
    private Integer price;

    @Column(name = "ordered_at")
    @Schema(description = "주문 완료일")
    private LocalDateTime orderedAt; // 점주가 포스기 입력하였을때 update

    // 점주가 포스기 입력시점에 주문완료일 update 하는 method
    private void updateOrderedAt(LocalDateTime orderedAt){
        this.orderedAt = orderedAt;
    }


}
