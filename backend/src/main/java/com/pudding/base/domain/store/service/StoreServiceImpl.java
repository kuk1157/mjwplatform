package com.pudding.base.domain.store.service;

import com.pudding.base.domain.store.dto.StoreDto;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService{

    private final StoreRepository storeRepository;

    public Page<StoreDto> getAllStore(Pageable pageable, String keyword){
        return storeRepository.findByStoreSearch(pageable, keyword);
    }


}
