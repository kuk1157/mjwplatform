package com.pudding.base.domain.customer.service;


import com.pudding.base.domain.customer.dto.CustomerDto;

public interface CustomerService {
    CustomerDto createCustomer(CustomerDto.Request customerDto);
}
