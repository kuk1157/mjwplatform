package com.pudding.base.domain.visit.controller;

import com.pudding.base.domain.common.enums.IsPaymentStatus;
import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.visit.dto.VisitLogDto;
import com.pudding.base.domain.visit.service.VisitLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "방문 기록 관련 API", description = "방문 기록 전체 API (점주 금액 입력시 해당 기록 기준으로 입력)")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/visits")
public class VisitLogController {

    private final VisitLogService visitLogService;


    @Operation(summary = "방문 기록 등록", description = "현재는 임시로 did 직접 입력하는 형태로 진행 추후엔 아마 다대구연동")
    @PostMapping("/{storeNum}/{tableNumber}")
    public ResponseEntity<VisitLogDto> createVisitLog(String did, @PathVariable Integer storeNum, @PathVariable Integer tableNumber){
        VisitLogDto createVisitLogs = visitLogService.createVisitLog(did,storeNum,tableNumber);
        return ResponseEntity.ok(createVisitLogs);
    }

    @Operation(summary = "방문 기록 조회", description = "방문기록 알람에 활용될 api")
    @GetMapping("/{storeNum}")
    public ResponseEntity<List<VisitLogDto>> getAllVisitLog(@PathVariable Integer storeNum){
        List<VisitLogDto> visitLogs = visitLogService.getAllVisitLog(storeNum);
        return ResponseEntity.ok(visitLogs);
    }

    @Operation(summary = "신규 방문(주문) 기록 조회 ", description = "visit_status = n, payment_status = n 결제금액 입력가능 데이터만")
    @GetMapping("/new/{storeNum}")
    public ResponseEntity<List<VisitLogDto>> getStoreByAndVisitStatusAndPaymentStatusByVisitLog(@PathVariable Integer storeNum, IsPaymentStatus paymentStatus, IsVisitStatus visitStatus){
        List<VisitLogDto> visitLogs = visitLogService.getStoreByAndVisitStatusAndPaymentStatusByVisitLog(storeNum, paymentStatus, visitStatus);
        return ResponseEntity.ok(visitLogs);
    }

}
