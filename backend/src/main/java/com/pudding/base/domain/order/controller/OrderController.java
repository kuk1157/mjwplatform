package com.pudding.base.domain.order.controller;

import com.pudding.base.domain.order.dto.OrderDto;
import com.pudding.base.domain.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "주문 관련 전체 API", description = "주문에 대한 모든 API(추후 QR 인증 후 연동 되는 단계이다.)")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders/{storeNum}/{tableNumber}")
public class OrderController {
    private final OrderService orderService;

    @Operation(summary = "주문 생성", description = "임시로 각 테이블에서 주문버튼 눌러서 진행하는 형태로(추후변경)")
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto.Request orderDto, @PathVariable Integer storeNum, @PathVariable Integer tableNumber){
        OrderDto createOrder = orderService.createOrder(orderDto, storeNum, tableNumber);
        return ResponseEntity.ok(createOrder);
    }
}
