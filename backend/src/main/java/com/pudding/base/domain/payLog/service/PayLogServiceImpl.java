package com.pudding.base.domain.payLog.service;

import com.pudding.base.domain.payLog.dto.PayLogDto;
import com.pudding.base.domain.payLog.entity.PayLog;
import com.pudding.base.domain.payLog.repository.PayLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;



@RequiredArgsConstructor
@Service
public class PayLogServiceImpl implements PayLogService {

    private final PayLogRepository payLogRepository;

    // 결제내역 전체 조회
    public Page<PayLogDto> findAllPayLogs(Pageable pageable){
        Page<PayLog> payLogs = payLogRepository.findAll(pageable);
        return payLogs.map(PayLogDto::fromEntity);
    }
}
