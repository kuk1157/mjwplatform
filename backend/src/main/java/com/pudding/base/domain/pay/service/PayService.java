package com.pudding.base.domain.pay.service;
import com.pudding.base.domain.common.dto.PriceCount;
import com.pudding.base.domain.pay.dto.PayDto;
import com.pudding.base.domain.pay.entity.Pay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PayService {
    // 결제 등록
    PayDto createPay(PayDto.Request payDto, Integer visitLogId);

    // 결제 전체 조회
    Page<PayDto> findAllPays(Pageable pageable);

    // 결제 단건 조회
    PayDto findByPayId(Integer id);

    // 결제 ownerId 기준 점주기준 조회
    Page<PayDto> findByOwnerId(Pageable pageable, Integer ownerId);

    // 결제 customerId 기준 점주기준 조회
    Page<PayDto> findByCustomerId(Pageable pageable, Integer customerId);

    // 고객 모바일 3가지 금액 통계
    PriceCount getCustomerByPayTotal(Integer customerId);
}
