package com.pudding.base.domain.pay.service;

import com.pudding.base.domain.pay.dto.PayDto;
import com.pudding.base.domain.pay.entity.Pay;
import com.pudding.base.domain.pay.repository.PayRepository;
import lombok.RequiredArgsConstructor;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PayServiceImpl implements PayService {

    private final PayRepository payRepository;

    @Transactional(readOnly = true)
    public Page<PayDto> findAllPays(Pageable pageable) {
        Page<Pay> pays = payRepository.findAll(pageable);
        return pays.map(PayDto::fromEntity);
    }

}
