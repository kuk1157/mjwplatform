package com.pudding.base.domain.pointCashOutRequest.service;


import com.pudding.base.domain.pointCashOutRequest.dto.PointCashOutRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PointCashOutRequestService {

    // 현금화 신청 등록
    PointCashOutRequestDto createCashRequest(PointCashOutRequestDto.Request pointCashOutRequestDto, Integer memberId);

    // 현금화 신청 가맹점 별 조회
    Page<PointCashOutRequestDto> getStoreIdCashRequests(Integer storeId, Pageable pageable);
}
