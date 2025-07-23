package com.pudding.base.domain.store.service;

import com.pudding.base.domain.store.dto.StoreDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StoreService {

    // 매장(store) 전체 조회
    Page<StoreDto> getAllStore(Pageable pageable, String keyword);

    // 매장(store) 등록
    StoreDto createStore(StoreDto.Request storeDto);
}
