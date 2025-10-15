package com.pudding.base.domain.storeStamp.service;


import com.pudding.base.domain.storeStamp.dto.StoreStampDto;

public interface StoreStampService {
    // 가맹점 스탬프 등록
    StoreStampDto createStoreStamps(Integer customerId, Integer storeId);

    // 가맹점 스탬프 중복 등록 체크
    boolean checkStoreStampExists(Integer customerId, Integer storeId);
}
