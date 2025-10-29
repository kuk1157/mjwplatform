package com.pudding.base.domain.pointCashOutRequest.controller;

import com.pudding.base.domain.common.dto.PriceCount;
import com.pudding.base.domain.common.dto.SearchPriceDto;
import com.pudding.base.domain.pointCashOutRequest.dto.PointCashOutRequestDto;
import com.pudding.base.domain.pointCashOutRequest.service.PointCashOutRequestService;
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

import java.time.LocalDate;


@Tag(name = "현금화 신청 API", description = "현금화 신청 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/pointCashOutRequests")
public class PointCashOutRequestAdminController {

    private final PointCashOutRequestService pointCashOutRequestService;

    @Operation(summary = "현금화 통계", description = "데이터 개수, 합계금액 2가지 차트")
    @GetMapping("/analytics/cash")
    public ResponseEntity<SearchPriceDto> cashAnalytics(@RequestParam(required = false) LocalDate start, @RequestParam(required = false) LocalDate end) {

        if(start == null){
            start = LocalDate.of(1900,1,1);
        }
        if(end == null){
            end = LocalDate.of(9999,12,31);
        }
        SearchPriceDto searchPriceDto = pointCashOutRequestService.cashAnalytics(start,end);
        return ResponseEntity.ok(searchPriceDto);
    }

    @Operation(summary = "현금화 최종 통계", description = "대시보드 형태로 4개 형태(전체 데이터 기준)")
    @GetMapping("/analytics/cash/total")
    public PriceCount getCashTotal(){
        return pointCashOutRequestService.getCashTotal();
    }

}
