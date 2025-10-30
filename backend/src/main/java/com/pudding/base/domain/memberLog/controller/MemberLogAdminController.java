package com.pudding.base.domain.memberLog.controller;

import com.pudding.base.domain.common.dto.SearchDateDto;
import com.pudding.base.domain.memberLog.service.MemberLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Tag(name="사용자 로그인/로그아웃 기록 API", description = "사용자 로그인/로그아웃 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class MemberLogController {
    private final MemberLogService memberLogService;

    @Operation(summary = "접속 통계(로그인 데이터)", description = "전체 데이터 count(검색 항목 4가지 포함)")
    @GetMapping("/memberLogs/analytics/traffic")
    public ResponseEntity<SearchDateDto> trafficCount(@RequestParam(required = false) LocalDate start, @RequestParam(required = false) LocalDate end) {

        if(start == null){
            start = LocalDate.of(1900,1,1);
        }
        if(end == null){
            end = LocalDate.of(9999,12,31);
        }
        SearchDateDto searchDateDto = memberLogService.trafficCount(start,end);
        return ResponseEntity.ok(searchDateDto);
    }
}
