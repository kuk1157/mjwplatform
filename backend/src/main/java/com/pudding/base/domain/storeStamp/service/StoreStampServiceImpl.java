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
    public StoreStampDto createStoreStamps(Integer storeId, Integer customerId) {
        StoreStamp storeStamp = StoreStamp.builder()
                .storeId(storeId)
                .customerId(customerId)
                .build();
        StoreStamp savedStoreStamp = storeStampRepository.save(storeStamp);
        return StoreStampDto.fromEntity(savedStoreStamp);
    }
}
