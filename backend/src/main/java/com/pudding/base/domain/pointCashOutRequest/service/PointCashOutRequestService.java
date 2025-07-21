package com.pudding.base.domain.pointCashOutRequest.service;


import com.pudding.base.domain.pointCashOutRequest.dto.PointCashOutRequestDto;

public interface PointCashOutRequestService {

    PointCashOutRequestDto createCashRequest(PointCashOutRequestDto.Request pointCashOutRequestDto, Integer memberId);

}
