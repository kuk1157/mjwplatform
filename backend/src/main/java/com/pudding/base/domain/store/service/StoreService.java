package com.pudding.base.domain.store.service;

import com.pudding.base.domain.store.dto.StoreDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StoreService {

    // 매장(store) 전체 조회
    Page<StoreDto> getAllStore(Pageable pageable, String keyword);

    // 매장(store) 등록
    StoreDto createStore(StoreDto.Request storeDto);

    // 매장(store) 수정
    StoreDto updateStore(StoreDto.Request storeDto, Integer id);

    // 매장(store) 상세 조회
    StoreDto findStoreById(Integer id);

    // 매장(store) 상세 조회 (점주 고유번호 ownerId 기준으로)
    StoreDto findStoreByOwnerId(Integer ownerId);


}
