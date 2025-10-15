package com.pudding.base.domain.storeStamp.controller;


import com.pudding.base.domain.storeStamp.dto.StoreStampDto;
import com.pudding.base.domain.storeStamp.service.StoreStampService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@Tag(name = "가맹점 스탬프 관련 api", description = "가맹점 스탬프(도장) 관련 전체 api")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/storeStamps")
public class StoreStampController {
    private final StoreStampService storeStampService;

    @Operation(summary = "가맹점 스탬프 등록", description= "다대구 로그인 후 미방문한 가맹점일 경우 INSERT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @PostMapping
    public ResponseEntity<StoreStampDto> createStoreStamps(Integer customerId, Integer storeId){
        StoreStampDto savedStoreStamp = storeStampService.createStoreStamps(customerId,storeId);
        return ResponseEntity.ok(savedStoreStamp);
    }

    @Operation(summary = "고객 방문 스탬프 조회", description = "특정 고객 방문 스탬프 조회")
    @GetMapping("/{customerId}")
    public ResponseEntity<List<StoreStampDto>> getCustomerIdStamps(Integer customerId) {
        List<StoreStampDto> storeStampDto = storeStampService.getCustomerIdStamps(customerId);
        return ResponseEntity.ok(storeStampDto);
    }

    @Operation(summary ="스탬프 고객,매장 기준으로 조회", description = "가맹점 스탬프 중복발급 예외 처리를 위한 API")
    @GetMapping
    public ResponseEntity<Boolean> checkStoreStampExists(Integer customerId, Integer storeId){
        boolean exists = storeStampService.checkStoreStampExists(customerId, storeId);
        return ResponseEntity.ok(exists);
    }
}
