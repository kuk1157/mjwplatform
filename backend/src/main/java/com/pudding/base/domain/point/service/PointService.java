package com.pudding.base.domain.point.service;

import com.pudding.base.domain.common.dto.PriceCount;
import com.pudding.base.domain.common.dto.SearchDateDto;
import com.pudding.base.domain.common.dto.SearchPriceDto;
import com.pudding.base.domain.point.dto.PointDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface PointService {

    // 포인트 등록
    PointDto createPoints(Integer payId, Integer storeId, Integer ownerId, Integer finalAmount, Double discount);

    // 포인트 전체 조회
    Page<PointDto> findAllPoint(Pageable pageable);

    // 점주 포인트 조회
    Page<PointDto> findByOwnerIdPoint(Pageable pageable, Integer ownerID);

    // 포인트 통계 (개수, 포인트)
    SearchPriceDto pointAnalytics(LocalDate start, LocalDate end);

    // 포인트 최종 통계 대시보드(전체 데이터 기준)
    PriceCount getPointTotal();
}
