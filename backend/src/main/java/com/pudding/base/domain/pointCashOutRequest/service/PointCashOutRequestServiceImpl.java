package com.pudding.base.domain.pointCashOutRequest.service;


import com.pudding.base.domain.common.dto.PriceCount;
import com.pudding.base.domain.common.dto.SearchPriceDto;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointCashOutRequestServiceImpl implements PointCashOutRequestService {

   private final PointCashOutRequestRepository pointCashOutRequestRepository;
   private final StoreRepository storeRepository; // 점주 테이블
   private final MemberRepository memberRepository; // 회원 테이블

    @Transactional
    @Override
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
    @Override
    public Page<PointCashOutRequestDto> getStoreIdCashRequests(Integer storeId, Pageable pageable) {
        Page<PointCashOutRequest> pointCashOutRequests = pointCashOutRequestRepository.findByStoreId(storeId, pageable);
        return pointCashOutRequests.map(PointCashOutRequestDto::fromEntity);
    }

    // 현금화 통계 - 합계금액, 합계 수
    @Override
    public SearchPriceDto cashAnalytics(LocalDate start, LocalDate end){
        List<PriceCount> daily = pointCashOutRequestRepository.countDaily(start, end);
        List<PriceCount> monthly = pointCashOutRequestRepository.countMonthly(start, end);
        List<PriceCount> yearly = pointCashOutRequestRepository.countYearly(start, end);

        long customCount = daily.stream().mapToLong(PriceCount::getCount).sum();

        return SearchPriceDto.builder()
                .daily(daily)
                .monthly(monthly)
                .yearly(yearly)
                .customCount(customCount)
                .build();
    }

    // 현금화 통계 - 4가지 금액
    @Override
    public PriceCount getCashTotal(){
        return pointCashOutRequestRepository.getCashTotal();
    }

}
