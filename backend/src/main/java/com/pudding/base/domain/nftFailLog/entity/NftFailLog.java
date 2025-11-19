package com.pudding.base.domain.nftFailLog.entity;
import com.pudding.base.domain.common.entity.BaseTimeEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "nft_fail_log") // NFT 실패 로그
public class NftFailLog extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "nft_id")
    @Schema(description = "nft 고유번호")
    private Integer nftId;

    @Column(name = "error_category")
    @Schema(description = "에러 종류(검증실패, 다운로드)")
    private String errorCategory;

    @Column(name = "error_type")
    @Schema(description = "에러타입")
    private String errorType;

    @Column(name = "korean_msg")
    @Schema(description = "한글 메시지")
    private String koreanMsg;

    @Column(name = "error_msg")
    @Schema(description = "영어 에러 메시지")
    private String errorMsg;

    @Builder
    public NftFailLog(Integer id,Integer nftId, String errorCategory, String errorType, String koreanMsg, String errorMsg){
        this.id = id;
        this.nftId = nftId;
        this.errorCategory = errorCategory;
        this.errorType = errorType;
        this.koreanMsg = koreanMsg;
        this.errorMsg = errorMsg;
    }

}
