package com.pudding.base.domain.customer.service;

import com.pudding.base.domain.customer.dto.CustomerDto;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
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
                .build();

        Customer savedCustomer = customerRepository.save(customer);
        return CustomerDto.fromEntity(savedCustomer);
    }

    // 고객 상세 조회
    public CustomerDto getCustomerById(Integer customerId){
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 고객입니다."));
        return CustomerDto.fromEntity(customer);
    }


}
