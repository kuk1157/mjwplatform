package com.pudding.base.domain.store.controller;

import com.pudding.base.domain.member.dto.MemberDto;
import com.pudding.base.domain.store.dto.StoreDto;
import com.pudding.base.domain.store.dto.StoreRequestDto;
import com.pudding.base.domain.store.dto.StoreUpdateDto;
import com.pudding.base.domain.store.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Tag(name = "매장(store) 관련 전체 테이블", description= "관리자 전용, 매장 CRUD")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/stores")
public class StoreController {
    private final StoreService storeService;

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @Operation(summary = "매장(store) 등록", description = "관리자 전산에서 매장 등록")
    @PostMapping
    public ResponseEntity<StoreDto> createStore(@RequestParam("ownerId") Integer ownerId, @RequestParam("name") String name, @RequestParam("address") String address, @RequestParam(value = "file", required = false) MultipartFile file){
        StoreRequestDto storeRequestDto = new StoreRequestDto(ownerId, name, address);
        StoreDto createStore = storeService.createStore(storeRequestDto, file);
        return ResponseEntity.ok(createStore);
    }

    @Operation(summary = "매장(store) 수정", description = "관리자 전산에서 매장 수정(매장이름, 매장주소, 썸네일만 가능)")
    @PutMapping("/{id}")
    public ResponseEntity<StoreDto> updateStore(@RequestParam("name") String name, @RequestParam("address") String address,
                                                @PathVariable Integer id, @RequestParam(value = "file", required = false) MultipartFile file){
        StoreUpdateDto storeUpdateDto = new StoreUpdateDto(name, address);
        StoreDto updateStore = storeService.updateStore(storeUpdateDto, id, file);
        return ResponseEntity.ok(updateStore);
    }


    @Operation(summary = "매장(store) 리스트", description = "매장 목록 조회")
    @GetMapping
    public ResponseEntity<Page<StoreDto>> getAllStore(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                                                      @RequestParam(value ="keyword",required = false) String keyword){
        Page<StoreDto> getStores = storeService.getAllStore(pageable, keyword);
        return ResponseEntity.ok(getStores);
    }

    @Operation(summary = "매장(store) 상세보기", description = "매장 상세 조회")
    @GetMapping("{id}")
    public ResponseEntity<StoreDto> getStoreById(@PathVariable Integer id){
        StoreDto store = storeService.findStoreById(id);
        return ResponseEntity.ok(store);
    }

    @Operation(summary = "매장(store) 상세보기", description = "매장 점주 고유번호 기준으로 상세 조회")
    @GetMapping("/ownerId/{ownerId}")
    public ResponseEntity<StoreDto> getStoreByOwnerId(@PathVariable Integer ownerId){
        StoreDto store = storeService.findStoreByOwnerId(ownerId);
        return ResponseEntity.ok(store);
    }

    @Operation(summary = "매장 등록 시 점주 선택", description = "가맹점 보유하고 있지 않은 점주만 조회")
    @GetMapping("/available-owners")
    public ResponseEntity<List<MemberDto>> getAvailableOwners(){
        return ResponseEntity.ok(storeService.getAvailableOwners());
    }




}
