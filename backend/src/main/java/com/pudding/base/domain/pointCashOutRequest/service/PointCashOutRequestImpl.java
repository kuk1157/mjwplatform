package com.pudding.base.domain.pointCashOutRequest.service;


import com.pudding.base.domain.pointCashOutRequest.dto.PointCashOutRequestDto;
import com.pudding.base.domain.pointCashOutRequest.entity.PointCashOutRequest;
import com.pudding.base.domain.pointCashOutRequest.repository.PointCashOutRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PointCashOutRequestImpl implements PointCashOutRequestService {

   private final PointCashOutRequestRepository pointCashOutRequestRepository;

    @Transactional
    public PointCashOutRequestDto createCashRequest(PointCashOutRequestDto.Request pointCashOutRequestDto){
        PointCashOutRequest request = PointCashOutRequest.builder()
                .cash(pointCashOutRequestDto.getCash())
                .requestAt(LocalDateTime.now())
                .build();
        pointCashOutRequestRepository.save(request);

        return PointCashOutRequestDto.fromEntity(request);
    }
}
