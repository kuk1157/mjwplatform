package com.pudding.base.domain.nft.entity;
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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "nft")
public class Nft {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "token_id")
    @Schema(description = "토큰 고유번호")
    private String tokenId;

    @Column(name = "token_hash")
    @Schema(description = "token 진위여부 검증값")
    private String tokenHash;

    @Column(name = "mint_hash")
    @Schema(description = "nft 거래내역 검증용 mint hash")
    private String mintHash;

    @Column(name = "store_id")
    @Schema(description = "매장 고유번호")
    private Integer storeId;

    @Column(name = "customer_id")
    @Schema(description = "고객 고유번호")
    private Integer customerId;

    @Column(name = "store_table_id")
    @Schema(description = "매장 테이블 고유번호")
    private Integer storeTableId;

    @Column(name = "nft_idx")
    @Schema(description = "nft 고유번호")
    private Integer nftIdx;

    @Column(name = "nft_url")
    @Schema(description = "nft 암호화 uri")
    private String nftUrl;

    @Column(name = "enc_id")
    @Schema(description = "복호화 ID")
    private Integer encId;

    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;

    @Builder
    public Nft(Integer id, String tokenId, String tokenHash, String mintHash, Integer storeId, Integer customerId, Integer storeTableId, Integer nftIdx, String nftUrl, Integer encId, LocalDateTime createdAt) {
        this.id = id;
        this.tokenId = tokenId;
        this.tokenHash = tokenHash;
        this.mintHash = mintHash;
        this.storeId = storeId;
        this.customerId = customerId;
        this.storeTableId = storeTableId;
        this.nftIdx = nftIdx;
        this.nftUrl = nftUrl;
        this.encId = encId;
        this.createdAt = createdAt;
    }
}
