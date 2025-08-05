package com.pudding.base.domain.store.service;

import com.pudding.base.domain.store.dto.StoreDto;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService{

    private final StoreRepository storeRepository;

    // 매장 등록
    public StoreDto createStore(StoreDto.Request storeDto){
        // 매장 이미 보유하고 있는 점주 예외처리
        boolean exists = storeRepository.existsById(storeDto.getOwnerId());
        if (exists) {
            throw new IllegalStateException("선택한 점주는 이미 매장을 보유하고 있습니다.");
        }

        Store store = Store.builder()
                .ownerId(storeDto.getOwnerId())
                .name(storeDto.getName())
                .address(storeDto.getAddress())
                .build();

        Store savedStore = storeRepository.save(store);
        return StoreDto.fromEntity(savedStore);
    }

    public StoreDto updateStore(StoreDto.Request storeDto, Integer id){
        Store store = storeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 매장 입니다."));
        store.updateStoreInfo(storeDto.getName(), storeDto.getAddress());
        storeRepository.save(store);
        return StoreDto.fromEntity(store);
    }

    // 매장 전체 조회
    public Page<StoreDto> getAllStore(Pageable pageable, String keyword){
        return storeRepository.findByStoreSearch(pageable, keyword);
    }

    // 매장 상세 조회
    public StoreDto findStoreById(Integer id){
        return storeRepository.findByStoreIdSearch(id);
    }

    // 매장 상세 조회 - 메인 대시보드 용도
    public StoreDto findStoreByOwnerId(Integer ownerId){
        return storeRepository.findByOwnerIdSearch(ownerId);
    }


}
