package com.pudding.base.domain.visit.entity;

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
@Table(name="qr_visit_log")
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

    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;

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
