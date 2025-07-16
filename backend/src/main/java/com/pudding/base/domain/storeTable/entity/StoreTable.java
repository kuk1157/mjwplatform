package com.pudding.base.domain.storeTable.entity;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Table(name = "store_table") // // store_table 테이블 (매장테이블 테이블)
public class StoreTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Long id;

    @Column(name = "store_id")
    @Schema(description = "매장 고유번호")
    private Integer storeId;

    @Column(name = "table_number")
    @Schema(description = "테이블 번호")
    private Integer tableNumber;

}
