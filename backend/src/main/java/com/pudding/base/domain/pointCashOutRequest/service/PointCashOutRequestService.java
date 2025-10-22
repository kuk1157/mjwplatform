package com.pudding.base.domain.pointCashOutRequest.service;


import com.pudding.base.domain.common.dto.PriceCount;
import com.pudding.base.domain.common.dto.SearchPriceDto;
import com.pudding.base.domain.pointCashOutRequest.dto.PointCashOutRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface PointCashOutRequestService {

    // 현금화 신청 등록
    PointCashOutRequestDto createCashRequest(PointCashOutRequestDto.Request pointCashOutRequestDto, Integer memberId);

    // 현금화 신청 가맹점 별 조회
    Page<PointCashOutRequestDto> getStoreIdCashRequests(Integer storeId, Pageable pageable);

    // 현금화 전체 통계
    SearchPriceDto cashAnalytics(LocalDate start, LocalDate end);

    // 현금화 4가지 금액(합계, 평균, 최소, 최대)
    PriceCount getCashTotal();
}
