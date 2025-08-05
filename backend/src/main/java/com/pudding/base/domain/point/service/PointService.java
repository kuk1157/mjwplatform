package com.pudding.base.domain.point.service;

import com.pudding.base.domain.point.dto.PointDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PointService {

    // 포인트 전체 조회
    Page<PointDto> findAllPoint(Pageable pageable);

    // 점주 포인트 조회
    Page<PointDto> findByOwnerIdPoint(Pageable pageable, Integer ownerID);
}
