package com.pudding.base.domain.storeTable.controller;

import com.pudding.base.domain.store.dto.StoreDto;
import com.pudding.base.domain.storeTable.dto.StoreTableDto;
import com.pudding.base.domain.storeTable.service.StoreTableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Tag(name = "매장 테이블 전체 api", description = "매장 테이블 관련 api (현재는 조회만)")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/stores/{storeId}/tables")
public class StoreTableController {
    private final StoreTableService storeTableService;

    @Operation(summary = "매장 테이블 등록", description = "등록폼 없이 버튼 클릭시 바로 등록 프로세스 진행(table 번호는 자동으로 붙음)")
    @PostMapping
    public ResponseEntity<StoreTableDto> createStoreTable(@PathVariable Integer storeId){
        StoreTableDto storeTableDto = storeTableService.createStoreTable(storeId);
        return ResponseEntity.ok(storeTableDto);
    }


    @Operation(summary = "매장 테이블 전체 조회", description = "매장 테이블 전체 조회 store고유번호 받아서 진행")
    @GetMapping
    public ResponseEntity<List<StoreTableDto>> getAllStoreTable(@PathVariable Integer storeId) {
        List<StoreTableDto> tables = storeTableService.getTablesByStoreId(storeId);
        return ResponseEntity.ok(tables);
    }

}
