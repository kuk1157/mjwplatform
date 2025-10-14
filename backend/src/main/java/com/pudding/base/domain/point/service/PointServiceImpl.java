package com.pudding.base.domain.point.service;

import com.pudding.base.domain.point.dto.PointDto;
import com.pudding.base.domain.point.entity.Point;
import com.pudding.base.domain.point.repository.PointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class PointServiceImpl implements PointService {

    private final PointRepository pointRepository;

    // 포인트 등록
    @Transactional
    public PointDto createPoints(Integer payId, Integer storeId, Integer ownerId, Integer finalAmount, Double discount) {
        Point point = Point.builder()
                .payId(payId)
                .storeId(storeId)
                .ownerId(ownerId)
                .orderPrice(finalAmount)
                .point(discount)
                .build();
        Point savedPoint = pointRepository.save(point);
        return PointDto.fromEntity(savedPoint);
    }



    // 포인트 전체 조회
    public Page<PointDto> findAllPoint(Pageable pageable){
        Page<Point> point = pointRepository.findAll(pageable);
        return point.map(PointDto::fromEntity);
    }

    // 포인트 전체 조회
    public Page<PointDto> findByOwnerIdPoint(Pageable pageable, Integer ownerId){
        Page<Point> point = pointRepository.findByOwnerId(pageable, ownerId);
        return point.map(PointDto::fromEntity);
    }


}
