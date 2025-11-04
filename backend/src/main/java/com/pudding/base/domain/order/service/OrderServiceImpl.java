package com.pudding.base.domain.order.service;

import com.pudding.base.domain.common.enums.IsOrderStatus;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.order.dto.OrderDto;
import com.pudding.base.domain.order.entity.Order;
import com.pudding.base.domain.order.repository.OrderRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.storeTable.entity.StoreTable;
import com.pudding.base.domain.storeTable.repository.StoreTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final StoreRepository storeRepository;

    @Transactional
    @Override
    public OrderDto createOrder(OrderDto.Request orderDto, Integer storeNum, Integer tableNumber){
        // 매장 체크
        Store store = storeRepository.findById(storeNum)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 매장입니다."));

        Order order = Order.builder()
                .storeId(storeNum) // 매장번호
                .ownerId(store.getOwnerId()) // 점주번호
                .storeTableId(tableNumber) // 테이블 넘버
                .userId(2) // 고객 임시로 고정
                .storeName(store.getName()) // 매장 이름
                .price(orderDto.getPrice()) // 입력받은 금액
                .status(IsOrderStatus.PENDING) // 주문 insert 되는순간 PENDING로 고정
                .build();

        Order savedOrder = orderRepository.save(order);
        return OrderDto.fromEntity(savedOrder);
    }

}
