package com.pudding.base.domain.nftFailLog.service;


import com.pudding.base.domain.nftFailLog.dto.NftFailLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface NftFailLogService {
    // 온체인 검증 실패 로그
    Page<NftFailLogDto> getNftFailLogs(Pageable pageable, String keyword);
}
