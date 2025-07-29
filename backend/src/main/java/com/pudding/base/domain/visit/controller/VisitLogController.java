package com.pudding.base.domain.visit.controller;

import com.pudding.base.domain.visit.dto.VisitLogDto;
import com.pudding.base.domain.visit.service.VisitLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "QR 인증기록 관련 API", description = "QR 인증 기록 전체 API (QR 인증 시 생성, 점주 금액 입력시 해당 기록 기준으로 입력)")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/visits/{storeNum}/{tableNumber}")
public class VisitLogController {

    private final VisitLogService qrvisitLogService;


    @Operation(summary = "QR 인증 기록 등록", description = "현재는 임시로 did직접 입력하는 형태로 진행 추후엔 아마 다대구연동")
    @PostMapping
    public ResponseEntity<VisitLogDto> createQrVisitLog(@RequestBody VisitLogDto.Request qrVisitLogDto, @PathVariable Integer storeNum, @PathVariable Integer tableNumber){
        VisitLogDto createVisitLogs = qrvisitLogService.createQrVisitLog(qrVisitLogDto,storeNum,tableNumber);
        return ResponseEntity.ok(createVisitLogs);
    }

}
