package com.pudding.base.domain.pay.controller;


import com.pudding.base.domain.pay.dto.PayDto;
import com.pudding.base.domain.pay.service.PayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Tag(name = "결제 API", description = "결제 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pay")
public class PayController {

    private final PayService payService;


    @Operation(summary = "결제 조회", description = "전체 결제 조회")
    @GetMapping
    public ResponseEntity<Page<PayDto>> getAllPays(Pageable pageable) {
        Page<PayDto> payDto = payService.findAllPays(pageable);
        return ResponseEntity.ok(payDto);
    }

}
