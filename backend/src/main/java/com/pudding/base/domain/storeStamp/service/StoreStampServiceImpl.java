package com.pudding.base.domain.storeStamp.service;

import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.storeStamp.dto.StoreStampDto;
import com.pudding.base.domain.storeStamp.entity.StoreStamp;
import com.pudding.base.domain.storeStamp.repository.StoreStampRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class StoreStampServiceImpl implements StoreStampService{
    private final StoreStampRepository storeStampRepository;

    // 가맹점 리포지터리
    private final StoreRepository storeRepository;

    // 고객 리포지터리
    private final CustomerRepository customerRepository;

    // 가맹점 스탬프 등록
    @Transactional
    public StoreStampDto createStoreStamps(Integer customerId, Integer storeId) {
        StoreStamp storeStamp = StoreStamp.builder()
                .customerId(customerId)
                .storeId(storeId)
                .build();

        // 고객 등급 및 쿠폰 관련 실행을 위한 객체 호출
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new CustomException("존재하지 않는 고객입니다."));

        // 가맹점 전체 개수
        Integer storeTotalCount = (int) storeRepository.count();

        // 가맹점 스탬프 중복체크
        boolean stampCheck = checkStoreStampExists(customerId, storeId);
        if(!stampCheck){
            StoreStamp savedStoreStamp = storeStampRepository.save(storeStamp);

            // 해당 고객의 전체 스탬프 개수확인
            Integer customerStampCount = storeStampRepository.countByCustomerId(customerId);
            System.out.println(customerStampCount);

            // 스탬프 개수에 따른 고객 등급 업그레이드
            switch(customerStampCount){
                case 4: // 4개 골드
                    customer.updateGradeToGold();
                    break;
                case 7: // 7개 플래티넘
                    customer.updateGradeToPlatinum();
                    break;
                case 10: // 10개 다이아몬드
                    customer.updateGradeToDiamond();
                    break;
                default:
            }

            // 고객의 쿠폰 발급 가능 여부 Y로 변경 (가능)
            if(customerStampCount == storeTotalCount){
                System.out.println("가맹점 스탬프를 모두 찍은 고객이기에 쿠폰 발급 가능해짐.");
                customer.updateCouponAvailable();
            }

            return StoreStampDto.fromEntity(savedStoreStamp);
        }else{
            return null;
        }
    }

    // 가맹점 스탬프 중복 체크 메서드
    public boolean checkStoreStampExists(Integer customerId, Integer storeId){
        return storeStampRepository.existsByCustomerIdAndStoreId(customerId,storeId);
    }

    // 고객 매장 방문 스탬프 조회
    public List<StoreStampDto> getCustomerIdStamps(Integer customerId) {
        List<StoreStamp> storeStamps = storeStampRepository.findByCustomerId(customerId);
        return storeStamps.stream().map(StoreStampDto::fromEntity).toList();
    }

    // 고객 매장 방문 스탬프 상세 조회
    public StoreStampDto getStoreStampById(Integer id){
        StoreStamp storeStamp = storeStampRepository.findById(id).orElseThrow(() -> new CustomException("존재하지 않는 방문 스탬프입니다."));
        return StoreStampDto.fromEntity(storeStamp);
    }

}
