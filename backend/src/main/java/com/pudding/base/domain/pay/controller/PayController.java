package com.pudding.base.domain.pay.controller;


import com.pudding.base.domain.pay.dto.PayDto;
import com.pudding.base.domain.pay.entity.Pay;
import com.pudding.base.domain.pay.service.PayService;
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


@Tag(name = "결제 API", description = "결제 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pay")
public class PayController {

    private final PayService payService;

    @Operation(summary = "결제 등록", description= "점주 포스기 입력시 insert")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @PostMapping("/{orderId}")
    public ResponseEntity<PayDto> createPay(@RequestBody PayDto.Request payDto, @PathVariable Integer orderId){
        PayDto savePay = payService.createPay(payDto,orderId);
        return ResponseEntity.ok(savePay);
    }

    @Operation(summary = "결제 조회", description = "전체 결제 조회")
    @GetMapping
    public ResponseEntity<Page<PayDto>> getAllPays(Pageable pageable) {
        Page<PayDto> payDto = payService.findAllPays(pageable);
        return ResponseEntity.ok(payDto);
    }

    @Operation(summary = "결제 단건 조회", description = "1개의 결제 조회")
    @GetMapping("/{id}")
    public ResponseEntity<PayDto> getPayById(@PathVariable Integer id) {
        PayDto payDto = payService.findByPayId(id);
        return ResponseEntity.ok(payDto);
    }

}
