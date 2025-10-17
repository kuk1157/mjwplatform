package com.pudding.base.domain.pointCashOutRequest.service;


import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.pointCashOutRequest.dto.PointCashOutRequestDto;
import com.pudding.base.domain.pointCashOutRequest.entity.PointCashOutRequest;
import com.pudding.base.domain.pointCashOutRequest.repository.PointCashOutRequestRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PointCashOutRequestServiceImpl implements PointCashOutRequestService {

   private final PointCashOutRequestRepository pointCashOutRequestRepository;
   private final StoreRepository storeRepository; // 점주 테이블
   private final MemberRepository memberRepository; // 회원 테이블

    @Transactional
    public PointCashOutRequestDto createCashRequest(PointCashOutRequestDto.Request pointCashOutRequestDto, Integer memberId){

        // 회원(memberId)아이디로 store 테이블에서 매장 id 가져오기
        Store store = storeRepository.findByOwnerId(memberId);

        // 매장을 찾지 못한 경우 예외 처리
        if (store == null || store.getId() == null) {
            throw new IllegalArgumentException ("매장을 찾을 수 없습니다.");
        }

        // 점주의 보유포인트 업데이트를 하기 위함
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("점주가 존재하지 않습니다."));

        PointCashOutRequest request = PointCashOutRequest.builder()
                .storeId(store.getId()) // 매장 고유번호
                .ownerId(memberId) // 점주 고유번호
                .cash(pointCashOutRequestDto.getCash())
                .requestAt(LocalDateTime.now())
                .build();
        pointCashOutRequestRepository.save(request);


        // 현금화 신청 금액 (+) - 점주 보유현금 (+)
        member.addTotalCash(pointCashOutRequestDto.getCash());

        // 현금화 신청 금액 (-) - 점주 보유포인트 (-)
        member.useTotalPoint(pointCashOutRequestDto.getCash());
        return PointCashOutRequestDto.fromEntity(request);
    }

    // 현금화 신청 가맹점 별 조회
    public Page<PointCashOutRequestDto> getStoreIdCashRequests(Pageable pageable, Integer storeId, Integer ownerId) {
        Page<PointCashOutRequest> pointCashOutRequests = pointCashOutRequestRepository.findByStoreIdAndOwnerId(pageable, storeId, ownerId);
        return pointCashOutRequests.map(PointCashOutRequestDto::fromEntity);
    }



}
