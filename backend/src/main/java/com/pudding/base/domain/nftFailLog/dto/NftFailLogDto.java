package com.pudding.base.domain.nftFailLog.dto;

import com.pudding.base.domain.nftFailLog.entity.NftFailLog;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class NftFailLogDto {
    private Integer id;
    private Integer nftId;
    private String errorCategory;
    private String errorType;
    private String koreanMsg;
    private String errorMsg;
    private LocalDateTime createdAt;


    @Builder
    public NftFailLogDto(Integer id,Integer nftId, String errorCategory, String errorType, String koreanMsg, String errorMsg, LocalDateTime createdAt){
        this.id = id;
        this.nftId = nftId;
        this.errorCategory = errorCategory;
        this.errorType = errorType;
        this.koreanMsg = koreanMsg;
        this.errorMsg = errorMsg;
        this.createdAt = createdAt;
    }

    public static NftFailLogDto fromEntity(NftFailLog nftFailLog){
        return NftFailLogDto.builder()
                .id(nftFailLog.getId())
                .nftId(nftFailLog.getNftId())
                .errorCategory(nftFailLog.getErrorCategory())
                .errorType(nftFailLog.getErrorType())
                .koreanMsg(nftFailLog.getKoreanMsg())
                .errorMsg(nftFailLog.getErrorMsg())
                .createdAt(nftFailLog.getCreatedAt())
                .build();
    }




}
