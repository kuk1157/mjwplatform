package com.pudding.base.domain.customer.controller;

import com.pudding.base.domain.customer.dto.CustomerDto;
import com.pudding.base.domain.customer.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "고객 관련 API", description = "고객 전체 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Operation(summary = "고객 등록 api", description = "qr 인증 시에 다대구 측과 연동하여 등록될 api")
    @PostMapping
    public ResponseEntity<CustomerDto> createCustomer(@RequestBody CustomerDto.Request customerDto){
        CustomerDto savedCustomer = customerService.createCustomer(customerDto);
        return ResponseEntity.ok(savedCustomer);
    }

}
