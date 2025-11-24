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

    @Column(name = "grade")
    @Schema(description = "점주 등급")
    private Integer grade; // 1,2,3,4 (실버,골드,플래티넘,다이아)
    // 50%, 60%, 70%, 80%

    @Column(name = "name")
    @Schema(description = "매장 이름")
    private String name;

    @Column(name = "address")
    @Schema(description = "매장 주소")
    private String address;

    @Column(name = "latitude")
    @Schema(description = "위도")
    private Double latitude;

    @Column(name = "longitude")
    @Schema(description = "경도")
    private Double longitude;

    // 파일업로드 1개용 썸네일 컬럼
    @Column(name = "thumbnail")
    private String thumbnail;

    // 파일업로드 1개용 확장자 컬럼
    @Column(name = "extension")
    private String extension;

    @Column(name = "nft_contract")
    @Schema(description = "nft 계약주소")
    private String nftContract;

    @Column(name = "nft_image")
    @Schema(description = "nft 이미지경로")
    private String nftImage;

    @Column(name = "nft_url")
    @Schema(description = "nft 파일경로")
    private String nftUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;

    @Builder
    public Store(Integer id, Integer ownerId, String name, String address, Double latitude, Double longitude, Integer grade, String nftContract, String nftImage,  String nftUrl, LocalDateTime createdAt){
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.grade = grade;
        this.nftContract = nftContract;
        this.nftImage = nftImage;
        this.nftUrl = nftUrl;
        this.createdAt = createdAt;
    }

    // 매장 수정 (매장이름, 매장주소만 수정)
    public void updateStoreInfo(String name, String address, double latitude, double longitude){
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
//// 매장 수정 (매장이름, 매장주소만 수정)
//public void updateStoreInfo(String name, String address){
//    this.name = name;
//    this.address = address;
//}

    // 파일업로드 1개용 썸네일 컬럼
    public void updateThumbnail(String thumbnail){
        this.thumbnail = thumbnail;
    }

    // 파일업로드 1개용 확장자 컬럼
    public void updateExtension(String extension){
        this.extension = extension;
    }
}
