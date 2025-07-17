package com.pudding.base.domain.pay.service;
import com.pudding.base.domain.pay.dto.PayDto;
import com.pudding.base.domain.pay.entity.Pay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PayService {
    // 결제 등록
    PayDto createPay(PayDto.Request payDto);

    // 결제 전체 조회
    Page<PayDto> findAllPays(Pageable pageable);

    // 결제 단건 조회
    PayDto findByPayId(Long id);

}
