package com.pudding.base.domain.storeStamp.service;


import com.pudding.base.domain.storeStamp.dto.StoreStampDto;

import java.util.List;

public interface StoreStampService {
    // 가맹점 스탬프 등록
    StoreStampDto createStoreStamps(Integer customerId, Integer storeId);

    // 가맹점 스탬프 중복 등록 체크
    boolean checkStoreStampExists(Integer customerId, Integer storeId);

    // 고객 방문 스탬프 조회 (모바일 UI 용도)
    List<StoreStampDto> getCustomerIdStamps(Integer customerId);
}
