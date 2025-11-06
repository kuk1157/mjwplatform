package com.pudding.base.domain.customer.service;

import com.pudding.base.domain.customer.dto.CustomerDto;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService{
    private final CustomerRepository customerRepository;

    @Transactional
    @Override
    public CustomerDto createCustomer(CustomerDto.Request customerDto){

        // 임시로 postman 진행
        Customer customer = Customer.builder()
                .did(customerDto.getDid())
                .build();

        Customer savedCustomer = customerRepository.save(customer);
        return CustomerDto.fromEntity(savedCustomer);
    }

    // 고객 상세 조회
    @Override
    public CustomerDto getCustomerById(Integer customerId){
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 고객입니다."));
        return CustomerDto.fromEntity(customer);
    }

    // 매장별 신규 가입자 수 조회
    @Override
    public CustomerDto getNewCustomers() {
        List<Map<String, Object>> resultList = customerRepository.findNewCustomersByStore();

        // Map 결과 → StoreNewCustomer DTO 리스트로 변환
        List<CustomerDto.StoreNewCustomer> stores = resultList.stream()
                .map(row -> new CustomerDto.StoreNewCustomer(
                        (String) row.get("storeName"),
                        ((Number) row.get("newCustomerCount")).intValue()
                ))
                .toList();

        // CustomerDto 객체에 stores만 세팅해서 리턴
        return new CustomerDto(stores);
    }



}
