package com.pudding.base.domain.payLog.service;

import com.pudding.base.domain.payLog.dto.PayLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface PayLogService {

    // 결제내역 전체 조회
    Page<PayLogDto> findAllPayLogs(Pageable pageable);
    // 점주 결제내역 조회
    Page<PayLogDto> findByOwnerIdPayLogs(Pageable pageable, Integer ownerId);
}