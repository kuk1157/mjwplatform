package com.pudding.base.domain.point.controller;

import com.pudding.base.domain.common.dto.PriceCount;
import com.pudding.base.domain.common.dto.SearchPriceDto;
import com.pudding.base.domain.point.dto.PointDto;
import com.pudding.base.domain.point.service.PointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

@Tag(name = "포인트 관련 api", description = "포인트 관련 전체 api")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class PointAdminController {

    private final PointService pointService;

    @Operation(summary = "포인트 통계", description = "데이터 개수, 합계금액 2가지 차트")
    @GetMapping("/analytics/point")
    public ResponseEntity<SearchPriceDto> pointAnalytics(@RequestParam(required = false) LocalDate start, @RequestParam(required = false) LocalDate end, @RequestParam(required = false) Long ownerId) {

        if(start == null){
            start = LocalDate.of(1900,1,1);
        }
        if(end == null){
            end = LocalDate.of(9999,12,31);
        }
        SearchPriceDto searchPriceDto = pointService.pointAnalytics(start,end);
        return ResponseEntity.ok(searchPriceDto);
    }

    @Operation(summary = "포인트 최종 통계", description = "대시보드 형태로 8개 형태(전체 데이터 기준)")
    @GetMapping("/analytics/point/total")
    public PriceCount getPointTotal(){
        return pointService.getPointTotal();
    }

    @Operation(summary = "점주 포인트 통계", description = "데이터 개수, 합계금액 2가지 차트")
    @GetMapping("/owner/analytics/point/{ownerId}")
    public ResponseEntity<SearchPriceDto> pointOwnerIdByAnalytics(@RequestParam(required = false) LocalDate start, @RequestParam(required = false) LocalDate end, @PathVariable Integer ownerId) {

        if(start == null){
            start = LocalDate.of(1900,1,1);
        }
        if(end == null){
            end = LocalDate.of(9999,12,31);
        }
        SearchPriceDto searchPriceDto = pointService.pointOwnerIdByAnalytics(start,end,ownerId);
        return ResponseEntity.ok(searchPriceDto);
    }

    @Operation(summary = "점주 포인트 최종 통계", description = "대시보드 형태로 4개 형태(전체 데이터 기준)")
    @GetMapping("/owner/analytics/point/total/{ownerId}")
    public PriceCount getOwnerIdByPointTotal(@PathVariable Integer ownerId){
        return pointService.getOwnerIdByPointTotal(ownerId);
    }
}
