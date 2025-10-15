package com.pudding.base.domain.storeStamp.service;

import com.pudding.base.domain.storeStamp.dto.StoreStampDto;
import com.pudding.base.domain.storeStamp.entity.StoreStamp;
import com.pudding.base.domain.storeStamp.repository.StoreStampRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class StoreStampServiceImpl implements StoreStampService{
    private final StoreStampRepository storeStampRepository;

    // 가맹점 스탬프 등록
    @Transactional
    public StoreStampDto createStoreStamps(Integer customerId, Integer storeId) {
        StoreStamp storeStamp = StoreStamp.builder()
                .storeId(customerId)
                .customerId(storeId)
                .build();

        // 가맹점 스탬프 중복체크
        boolean stampCheck = checkStoreStampExists(customerId, storeId);
        if(!stampCheck){
            StoreStamp savedStoreStamp = storeStampRepository.save(storeStamp);
            return StoreStampDto.fromEntity(savedStoreStamp);
        }else{
            return null;
        }
    }

    // 가맹점 스탬프 중복 체크 메서드
    public boolean checkStoreStampExists(Integer customerId, Integer storeId){
        return storeStampRepository.existsByStoreIdAndCustomerId(customerId,storeId);
    }
}
