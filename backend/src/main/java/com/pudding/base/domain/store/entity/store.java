package com.pudding.base.domain.store.entity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Table(name = "store") // store 테이블 (매장 테이블)
public class store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Long id;

    @Column(name = "owner_id")
    @Schema(description = "점주 고유번호")
    private Integer ownerId;

    @Column(name = "name")
    @Schema(description = "매장 이름")
    private String name;

    @Column(name = "address")
    @Schema(description = "매장 주소")
    private String address;

}
