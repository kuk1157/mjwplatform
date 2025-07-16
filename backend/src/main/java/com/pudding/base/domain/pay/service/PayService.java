package com.pudding.base.domain.pay.service;
import com.pudding.base.domain.pay.dto.PayDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PayService {
    Page<PayDto> findAllPays(Pageable pageable);
}
