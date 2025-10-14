package com.pudding.base.domain.payLog.controller;


import com.pudding.base.domain.payLog.dto.PayLogDto;
import com.pudding.base.domain.payLog.service.PayLogService;
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

@Tag(name = "결제내역 API", description = "결제내역 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payLog")
public class PayLogController {

    private final PayLogService payLogService;


    @Operation(summary = "결제 로그 등록", description= "결제 등록 되고 난 후에 바로 함께 INSERT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @PostMapping
    public ResponseEntity<PayLogDto> createPayLogs(Integer payId, Integer ownerId, Integer amount, Double discountAmount, Integer finalAmount){
        PayLogDto savePayLog = payLogService.createPayLogs(payId,ownerId,amount,discountAmount,finalAmount);
        return ResponseEntity.ok(savePayLog);
    }


    @Operation(summary = "결제내역 전체 조회", description ="결제 내역 전체 조회 api")
    @GetMapping
    public ResponseEntity<Page<PayLogDto>> getAllPayLogs(Pageable pageable){
        Page<PayLogDto> payLogDto = payLogService.findAllPayLogs(pageable);
        return ResponseEntity.ok(payLogDto);
    }

    @Operation(summary = "점주 결제내역 조회", description ="점주용 웹 플랫폼 메인 대시보드 용도")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Page<PayLogDto>> getOwnerIdByPayLogs(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable, @PathVariable Integer ownerId){
        Page<PayLogDto> payLogDto = payLogService.findByOwnerIdPayLogs(pageable, ownerId);
        return ResponseEntity.ok(payLogDto);
    }


}
