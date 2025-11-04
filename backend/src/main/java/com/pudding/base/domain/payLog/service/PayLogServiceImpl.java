package com.pudding.base.domain.payLog.service;

import com.pudding.base.domain.payLog.dto.PayLogDto;
import com.pudding.base.domain.payLog.entity.PayLog;
import com.pudding.base.domain.payLog.repository.PayLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@RequiredArgsConstructor
@Service
public class PayLogServiceImpl implements PayLogService {

    private final PayLogRepository payLogRepository;


    // 결제내역 등록
    @Transactional
    @Override
    public PayLogDto createPayLogs(Integer payId, Integer ownerId, Integer amount, Double discountAmount, Integer finalAmount) {
        PayLog paylog = PayLog.builder()
                .payId(payId)
                .ownerId(ownerId)
                .amount(amount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .build();
        PayLog savedPayLog = payLogRepository.save(paylog);
        return PayLogDto.fromEntity(savedPayLog);
    }

    // 결제내역 전체 조회
    @Override
    public Page<PayLogDto> findAllPayLogs(Pageable pageable){
        Page<PayLog> payLogs = payLogRepository.findAll(pageable);
        return payLogs.map(PayLogDto::fromEntity);
    }

    // 결제내역 전체 조회
    @Override
    public Page<PayLogDto> findByOwnerIdPayLogs(Pageable pageable, Integer ownerId){
        Page<PayLog> payLogs = payLogRepository.findAllByOwnerId(pageable,ownerId);
        return payLogs.map(PayLogDto::fromEntity);
    }
}
