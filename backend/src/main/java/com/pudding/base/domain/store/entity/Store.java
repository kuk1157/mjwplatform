package com.pudding.base.domain.store.entity;
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
@Table(name = "store") // store 테이블 (매장 테이블)
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "owner_id")
    @Schema(description = "점주 고유번호")
    private Integer ownerId;

    @Column(name = "name")
    @Schema(description = "매장 이름")
    private String name;

    @Column(name = "address")
    @Schema(description = "매장 주소")
    private String address;

    @Column(name = "nft_contract")
    @Schema(description = "nft 계약주소")
    private String nftContract;

    @Column(name = "nft_url")
    @Schema(description = "nft 파일경로")
    private String nftUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;

    @Builder
    public Store(Integer id, Integer ownerId, String name, String address, String nftContract, String nftUrl, LocalDateTime createdAt){
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.address = address;
        this.nftContract = nftContract;
        this.nftUrl = nftUrl;
        this.createdAt = createdAt;
    }

    // 매장 수정 (매장이름, 매장주소만 수정)
    public void updateStoreInfo(String name, String address){
        this.name = name;
        this.address = address;
    }

}
