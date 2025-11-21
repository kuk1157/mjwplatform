package com.pudding.base.domain.nftOnChainLog.dto;

import com.pudding.base.domain.nftOnChainLog.entity.NftOnChainLog;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class NftOnChainLogDto {
    private Integer id;
    private Integer nftId;
    private String onChainCategory;
    private String errorType;
    private String koreanMsg;
    private String errorMsg;
    private String txHash;
    private String txHashMessage;
    private LocalDateTime createdAt;


    @Builder
    public NftOnChainLogDto(Integer id, Integer nftId, String onChainCategory, String errorType, String koreanMsg, String errorMsg, String txHash, String txHashMessage, LocalDateTime createdAt){
        this.id = id;
        this.nftId = nftId;
        this.onChainCategory = onChainCategory;
        this.errorType = errorType;
        this.koreanMsg = koreanMsg;
        this.errorMsg = errorMsg;
        this.txHash = txHash;
        this.txHashMessage = txHashMessage;
        this.createdAt = createdAt;
    }

    public static NftOnChainLogDto fromEntity(NftOnChainLog nftOnChainLog){
        return NftOnChainLogDto.builder()
                .id(nftOnChainLog.getId())
                .nftId(nftOnChainLog.getNftId())
                .onChainCategory(nftOnChainLog.getOnChainCategory())
                .errorType(nftOnChainLog.getErrorType())
                .koreanMsg(nftOnChainLog.getKoreanMsg())
                .errorMsg(nftOnChainLog.getErrorMsg())
                .txHash(nftOnChainLog.getTxHash())
                .txHashMessage(nftOnChainLog.getTxHashMessage())
                .createdAt(nftOnChainLog.getCreatedAt())
                .build();
    }




}
