package com.pudding.base.domain.pay.controller;


import com.pudding.base.domain.common.dto.PriceCount;
import com.pudding.base.domain.pay.dto.PayDto;
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
    @PostMapping("/{visitLogId}")
    public ResponseEntity<PayDto> createPay(@RequestBody PayDto.Request payDto, @PathVariable Integer visitLogId){
        PayDto savePay = payService.createPay(payDto,visitLogId);
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


    @Operation(summary = "점주의 결제 조회", description = "ownerId 기준으로 조회")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Page<PayDto>> getOwnerIdByPays(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable, @PathVariable Integer ownerId) {
        Page<PayDto> payDto = payService.findByOwnerId(pageable, ownerId);
        return ResponseEntity.ok(payDto);
    }

    @Operation(summary = "고객의 결제 조회", description = "customerId 기준으로 조회")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Page<PayDto>> getCustomerIdByPays(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable, @PathVariable Integer customerId) {
        Page<PayDto> payDto = payService.findByCustomerId(pageable, customerId);
        return ResponseEntity.ok(payDto);
    }

    @Operation(summary = "모바일 고객 3가지 금액 통계", description = "가로 막대 그래프로 3개 보여줄 예정(날짜 컨트롤 x)")
    @GetMapping("/analytics/customer/{customerId}")
    public PriceCount getCustomerByPayTotal(@PathVariable Integer customerId){
        return payService.getCustomerByPayTotal(customerId);
    }



}
