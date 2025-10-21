package com.pudding.base.domain.point.controller;

import com.pudding.base.domain.common.dto.SearchDateDto;
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
@RequestMapping("/api/v1/points")
public class PointController {

    private final PointService pointService;

    @Operation(summary = "포인트 등록", description= "결제 등록 되고 난 후에 바로 함께 INSERT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @PostMapping
    public ResponseEntity<PointDto> createPoints(Integer payId, Integer storeId, Integer ownerId, Integer finalAmount, Double discount){
        PointDto savePoint = pointService.createPoints(payId,storeId,ownerId,finalAmount,discount);
        return ResponseEntity.ok(savePoint);
    }

    @Operation(summary = "포인트 전체 조회", description = "포인트 전체 조회 api")
    @GetMapping
    public ResponseEntity<Page<PointDto>> getAllPoint(Pageable pageable){
        Page<PointDto> pointDto = pointService.findAllPoint(pageable);
        return ResponseEntity.ok(pointDto);
    }

    @Operation(summary = "점주 포인트 조회", description = "점주 웹 플랫폼 대시보드 용도")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Page<PointDto>> getOwnerIdByPoint(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable, @PathVariable Integer ownerId){
        Page<PointDto> pointDto = pointService.findByOwnerIdPoint(pageable, ownerId);
        return ResponseEntity.ok(pointDto);
    }

    @Operation(summary = "포인트 통계", description = "데이터 개수, 합계금액 2가지 차트")
    @GetMapping("/admin/analytics/point")
    public ResponseEntity<SearchPriceDto> pointAnalytics(@RequestParam(required = false) LocalDate start, @RequestParam(required = false) LocalDate end) {

        if(start == null){
            start = LocalDate.of(1900,1,1);
        }
        if(end == null){
            end = LocalDate.of(9999,12,31);
        }
        SearchPriceDto searchPriceDto = pointService.pointAnalytics(start,end);
        return ResponseEntity.ok(searchPriceDto);
    }


//    @Operation(summary = "구매/결제 통계(구매신청 전체데이터)", description = "전체 데이터 count(검색 항목 4가지 포함)")
//    @GetMapping("/admin/analytics/point")
//    public ResponseEntity<SearchDateDto> paymentCount(@RequestParam(required = false) LocalDate start, @RequestParam(required = false) LocalDate end) {
//
//        if(start == null){
//            start = LocalDate.of(1900,1,1);
//        }
//        if(end == null){
//            end = LocalDate.of(9999,12,31);
//        }
//
//        SearchDateDto searchDateDto = pointService.pointCount(start,end);
//        return ResponseEntity.ok(searchDateDto);
//    }

}
