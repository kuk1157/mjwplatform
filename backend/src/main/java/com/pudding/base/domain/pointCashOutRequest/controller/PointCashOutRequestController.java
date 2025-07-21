package com.pudding.base.domain.pointCashOutRequest.controller;

import com.pudding.base.domain.pointCashOutRequest.dto.PointCashOutRequestDto;
import com.pudding.base.domain.pointCashOutRequest.service.PointCashOutRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Tag(name = "현금화 신청 API", description = "현금화 신청 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pointCashOutRequest")
public class PointCashOutRequestController {

    private final PointCashOutRequestService pointCashOutRequestService;

    @Operation(summary = "포인트 현금화 신청 API", description = "점주가 보유포인트를 현금화 하는 API")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @PostMapping
    public ResponseEntity<PointCashOutRequestDto> createCashRequest(@RequestBody PointCashOutRequestDto.Request pointCashOutRequestDto){
        PointCashOutRequestDto saveCashRequest = pointCashOutRequestService.createCashRequest(pointCashOutRequestDto);
        return ResponseEntity.ok(saveCashRequest);
    }
}
