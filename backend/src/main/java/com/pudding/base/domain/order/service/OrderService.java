package com.pudding.base.domain.order.service;


import com.pudding.base.domain.order.dto.OrderDto;

public interface OrderService {
    OrderDto createOrder(OrderDto.Request orderDto, Integer storeNum, Integer tableNumber);
}
