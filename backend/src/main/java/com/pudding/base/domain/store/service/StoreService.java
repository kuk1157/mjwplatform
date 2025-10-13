package com.pudding.base.domain.store.service;

import com.pudding.base.domain.member.dto.MemberDto;
import com.pudding.base.domain.store.dto.StoreDto;
import com.pudding.base.domain.store.dto.StoreRequestDto;
import com.pudding.base.domain.store.dto.StoreUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StoreService {

    // 매장(store) 전체 조회
    Page<StoreDto> getAllStore(Pageable pageable, String keyword);

    // 매장(store) 등록
    StoreDto createStore(StoreRequestDto storeRequestDto, MultipartFile file);

    // 매장(store) 수정
    StoreDto updateStore(StoreUpdateDto storeUpdateDto, Integer id, MultipartFile file);

    // 매장(store) 상세 조회
    StoreDto findStoreById(Integer id);

    // 매장(store) 상세 조회 (점주 고유번호 ownerId 기준으로)
    StoreDto findStoreByOwnerId(Integer ownerId);

    // 매장 등록시 -가맹점 보유하고 있지 않은 점주만 조회
    List<MemberDto> getAvailableOwners();


}
