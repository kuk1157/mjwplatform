package com.pudding.base.domain.pay.service;

import com.pudding.base.domain.pay.dto.PayDto;
import com.pudding.base.domain.pay.entity.Pay;
import com.pudding.base.domain.pay.repository.PayRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PayServiceImpl implements PayService {

    private final PayRepository payRepository;


    // 결제 등록
    @Transactional
    public PayDto createPay(PayDto.Request payDto){


        //주문번호, 매장번호, 점주번호, 고객번호도 다 업데이트 하는 로직 들어가야함.

        Double discount = payDto.getAmount() * 0.03; // 3% 할인금액 가져오기 0.03 추후에 platform_config 에서 가져오기
        Integer finalAmount = (int) (payDto.getAmount() - discount); // 최종금액(주문금액 - 할인금액)

        Pay pay = Pay.builder()
                .amount(payDto.getAmount())
                .discountAmount(discount)
                .finalAmount(finalAmount)
                .build();

        Pay savedPay = payRepository.save(pay);
        return PayDto.fromEntity(savedPay);
    }

    // 결제 전체 조회
    @Transactional(readOnly = true)
    public Page<PayDto> findAllPays(Pageable pageable) {
        Page<Pay> pays = payRepository.findAll(pageable);
        return pays.map(PayDto::fromEntity);
    }

    // 결제 상세 조회
    public PayDto findByPayId(Long id){
        Pay pay = payRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 결제입니다"));
        return PayDto.fromEntity(pay);
    }

}
