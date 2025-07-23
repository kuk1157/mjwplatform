package com.pudding.base.domain.store.controller;

import com.pudding.base.domain.store.dto.StoreDto;
import com.pudding.base.domain.store.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@Tag(name = "매장(store) 관련 전체 테이블", description= "관리자 전용, 매장 CRUD")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/stores")
public class StoreController {
    private final StoreService storeService;

//    @Operation(summary = "매장(store)등록", description = "관리자 전산에서 매장 등록")
//    @PostMapping
//    public ResponseEntity<StoreDto> createStore(@RequestBody StoreDto.Request storeDto){
//        StoreDto createStore = storeService.createStore(storeDto);
//        return ResponseEntity.ok(createStore);
//    }

    @Operation(summary = "매장(store) 리스트", description = "매장 목록 조회")
    @GetMapping
    public ResponseEntity<Page<StoreDto>> getAllStore(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                                                      @RequestParam(value ="keyword",required = false) String keyword){
        Page<StoreDto> getStores = storeService.getAllStore(pageable, keyword);
        return ResponseEntity.ok(getStores);
    }

}
