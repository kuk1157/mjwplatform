package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.visit.dto.VisitLogDto;
import com.pudding.base.domain.visit.entity.VisitLog;
import com.pudding.base.domain.visit.repository.VisitLogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VisitLogServiceImpl implements VisitLogService {

    private final VisitLogRepository visitLogRepository;
    private final CustomerRepository customerRepository;
    private final StoreRepository storeRepository;
    private final MemberRepository memberRepository;


    public VisitLogDto createQrVisitLog(VisitLogDto.Request visitDto, Integer storeNum, Integer tableNumber){
        Customer customer = customerRepository.findByDid(visitDto.getDid()).orElse(null);

        Member member = memberRepository.findByDid(visitDto.getDid()).orElse(null);

        Store store = storeRepository.findById(storeNum).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 매장입니다."));


        // member, customer 둘다 없을 경우
        if (customer == null || member == null) {
            if (member == null) {
                // 모바일 로그인 계정 추가
                member = memberRepository.save(
                        Member.builder()
                                .did(visitDto.getDid())
                                .build()
                );
            }
            if (customer == null) {
                // 고객 정보 남길 customer 추가 (생성된 memberId 남김)
                customer = customerRepository.save(
                        Customer.builder()
                                .did(visitDto.getDid())
                                .memberId(member.getId())
                                .build()
                );
            }
        }

        VisitLog visitLog = VisitLog.builder()
                .customerId(customer.getId())
                .ownerId(store.getOwnerId())
                .storeId(storeNum)
                .storeTableId(tableNumber)
                .storeName(store.getName())
                .build();
        VisitLog savedQrVisit = visitLogRepository.save(visitLog);
        return VisitLogDto.fromEntity(savedQrVisit);

    }
}
