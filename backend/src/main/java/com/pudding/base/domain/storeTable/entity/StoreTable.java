package com.pudding.base.domain.storeTable.entity;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@DynamicInsert // createdAt 생성일 insert,update 제외
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "store_table") // // store_table 테이블 (매장테이블 테이블)
public class StoreTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "store_id")
    @Schema(description = "매장 고유번호")
    private Integer storeId;

    @Column(name = "table_number")
    @Schema(description = "테이블 번호")
    private Integer tableNumber;

    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;


    @Builder
    public StoreTable(Integer id, Integer storeId, Integer tableNumber, LocalDateTime createdAt){
        this.id = id;
        this.storeId = storeId;
        this.tableNumber = tableNumber;
        this.createdAt = createdAt;
    }

}
