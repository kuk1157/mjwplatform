package com.pudding.base.domain.payLog.controller;


import com.pudding.base.domain.payLog.dto.PayLogDto;
import com.pudding.base.domain.payLog.service.PayLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "결제내역 API", description = "결제내역 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payLog")
public class PayLogController {

    private final PayLogService payLogService;


    @Operation(summary = "결제내역 전체 조회", description ="결제 내역 전체 조회 api")
    @GetMapping
    public ResponseEntity<Page<PayLogDto>> getAllPayLogs(Pageable pageable){
        Page<PayLogDto> payLogDto = payLogService.findAllPayLogs(pageable);
        return ResponseEntity.ok(payLogDto);
    }

}
