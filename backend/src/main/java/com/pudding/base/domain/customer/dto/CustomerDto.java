package com.pudding.base.domain.customer.dto;
import com.pudding.base.domain.common.enums.CouponAvailable;
import com.pudding.base.domain.common.enums.CouponStatus;
import com.pudding.base.domain.common.enums.CustomerGrade;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.customer.entity.Customer;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CustomerDto {
    private Integer id;
    private String did;
    private Integer memberId;
    private CustomerGrade customerGrade;
    private CouponAvailable couponAvailable;
    private CouponStatus couponStatus;
    private IsActive isActive;
    private LocalDateTime createdAt;

    @Builder
    public CustomerDto(Integer id, String did, Integer memberId, CustomerGrade customerGrade,CouponAvailable couponAvailable,CouponStatus couponStatus, IsActive isActive, LocalDateTime createdAt){
        this.id = id;
        this.did = did;
        this.memberId = memberId;
        this.customerGrade = customerGrade;
        this.couponAvailable = couponAvailable;
        this.couponStatus = couponStatus;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public static CustomerDto fromEntity(Customer customer){
        return CustomerDto.builder()
                .id(customer.getId())
                .did(customer.getDid())
                .memberId(customer.getMemberId())
                .customerGrade(customer.getCustomerGrade())
                .couponAvailable(customer.getCouponAvailable())
                .couponStatus(customer.getCouponStatus())
                .isActive(customer.getIsActive())
                .createdAt(customer.getCreatedAt())
                .build();
    }

    @Getter
    @NoArgsConstructor
    public static class Request{
        private String did;
        private String name;

        public Request(String did, String name){
            this.did = did;
            this.name = name;
        }
    }

}
