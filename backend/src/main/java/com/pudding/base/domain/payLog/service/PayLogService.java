package com.pudding.base.domain.payLog.service;

import com.pudding.base.domain.payLog.dto.PayLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface PayLogService {

    // 결제 전체 조회
    Page<PayLogDto> findAllPayLogs(Pageable pageable);
}