package com.pudding.base.domain.storeTable.controller;

import com.pudding.base.domain.storeTable.dto.StoreTableDto;
import com.pudding.base.domain.storeTable.service.StoreTableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@Tag(name = "매장 테이블 전체 api", description = "매장 테이블 관련 api (현재는 조회만)")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/stores/{storeNum}/tables")
public class StoreTableController {
    private final StoreTableService storeTableService;

    @Operation(summary = "매장 테이블 전체 조회", description = "매장 테이블 전체 조회 store고유번호 받아서 진행")
    @GetMapping
    public ResponseEntity<List<StoreTableDto>> getAllStoreTable(@PathVariable Integer storeNum) {
        List<StoreTableDto> tables = storeTableService.getTablesByStoreNum(storeNum);
        return ResponseEntity.ok(tables);
    }

}
