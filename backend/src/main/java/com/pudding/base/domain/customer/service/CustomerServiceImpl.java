package com.pudding.base.domain.customer.service;

import com.pudding.base.domain.customer.dto.CustomerDto;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.order.dto.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService{
    private final CustomerRepository customerRepository;


    @Transactional
    public CustomerDto createCustomer(CustomerDto.Request customerDto){


        // 임시로 postman 진행
        Customer customer = Customer.builder()
                .did(customerDto.getDid())
                .name(customerDto.getName())
                .build();

        Customer savedCustomer = customerRepository.save(customer);
        return CustomerDto.fromEntity(savedCustomer);

    }


}
