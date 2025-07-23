package com.pudding.base.domain.store.service;

import com.pudding.base.domain.store.dto.StoreDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StoreService {
    Page<StoreDto> getAllStore(Pageable pageable, String keyword);
}
