package com.pudding.base.domain.nftOnChainLog.service;


import com.pudding.base.domain.nftOnChainLog.dto.NftOnChainLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface NftOnChainLogService {
    // 온체인 검증 실패 로그
    Page<NftOnChainLogDto> getNftOnChainLogs(Pageable pageable, String keyword);
}
