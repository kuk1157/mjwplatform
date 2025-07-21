package com.pudding.base.domain.pointCashOutRequest.service;


import com.pudding.base.domain.pointCashOutRequest.dto.PointCashOutRequestDto;
import com.pudding.base.domain.pointCashOutRequest.entity.PointCashOutRequest;
import com.pudding.base.domain.pointCashOutRequest.repository.PointCashOutRequestRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PointCashOutRequestImpl implements PointCashOutRequestService {

   private final PointCashOutRequestRepository pointCashOutRequestRepository;
   private final StoreRepository storeRepository;

    @Transactional
    public PointCashOutRequestDto createCashRequest(PointCashOutRequestDto.Request pointCashOutRequestDto, Integer memberId){

        // 회원(memberId)아이디로 store 테이블에서 매장 id 가져오기
        Store store = storeRepository.findByOwnerId(memberId);

        // 매장을 찾지 못한 경우 예외 처리
        if (store == null || store.getId() == null) {
            throw new IllegalArgumentException ("매장을 찾을 수 없습니다.");
        }

        PointCashOutRequest request = PointCashOutRequest.builder()
                .storeId(store.getId()) // 매장 고유번호
                .ownerId(memberId) // 점주 고유번호
                .cash(pointCashOutRequestDto.getCash())
                .requestAt(LocalDateTime.now())
                .build();
        pointCashOutRequestRepository.save(request);

        return PointCashOutRequestDto.fromEntity(request);
    }
}
