package com.pudding.base.domain.customer.service;


import com.pudding.base.domain.customer.dto.CustomerDto;

public interface CustomerService {

    // 고객 등록
    CustomerDto createCustomer(CustomerDto.Request customerDto);

    // 고객 상세 조회
    CustomerDto getCustomerById(Integer customerId);
}
