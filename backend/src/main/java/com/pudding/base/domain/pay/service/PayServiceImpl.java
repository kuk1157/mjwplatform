package com.pudding.base.domain.pay.service;

import com.pudding.base.domain.common.enums.IsOrderStatus;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.order.entity.Order;
import com.pudding.base.domain.order.repository.OrderRepository;
import com.pudding.base.domain.pay.dto.PayDto;
import com.pudding.base.domain.pay.entity.Pay;
import com.pudding.base.domain.pay.repository.PayRepository;
import com.pudding.base.domain.payLog.entity.PayLog;
import com.pudding.base.domain.payLog.repository.PayLogRepository;
import com.pudding.base.domain.platformConfig.entity.PlatformConfig;
import com.pudding.base.domain.platformConfig.repository.PlatformConfigRepository;
import com.pudding.base.domain.point.entity.Point;
import com.pudding.base.domain.point.repository.PointRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PayServiceImpl implements PayService {

    private final PayRepository payRepository;
    private final PayLogRepository payLogRepository; // 결제내역 기본 jpa 리포지터리 가져오기
    private final PointRepository pointRepository; // 포인트 기본 jpa 리포지터리 가져오기
    private final OrderRepository orderRepository; // 주문 기본 jpa 리포지터리 가져오기
    private final MemberRepository memberRepository; // 회원 기본 jpa 리포지터리 가져오기
    private final PlatformConfigRepository platformConfigRepository; // 플랫폼 설정 기본 jpa 리포지터리 가져오기

    // 결제 등록
    @Transactional
    public PayDto createPay(PayDto.Request payDto, Integer orderId){

        // 주문과 결제는 1대1 매칭되어야 하기때문에 체크필요함.
        boolean exists = payRepository.existsById(orderId);
        if (exists) {
            throw new IllegalStateException("이미 결제가 등록된 주문입니다.");
        }

        // 주문 정보 가져오기 (orderId로 주문테이블 조회)
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 주문입니다"));

        // 주문상태가 대기일 경우에만 결제처리 되도록 - 위에서 1대1 무조건 막히지만, 혹시 몰라서 2차로 방어
        if (order.getStatus() == IsOrderStatus.COMPLETE) {
            throw new IllegalArgumentException("이미 결제처리가 완료된 주문은 결제 처리를 할 수 없습니다..");
        }

        // 회원 정보 가져오기(order.getOwnerId로 member 테이블 조회)
        Member member = memberRepository.findById(order.getOwnerId()).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 점주입니다."));

        // 플랫폼 설정 정보 가져오기
        PlatformConfig platformConfig = platformConfigRepository.findById(1).orElseThrow(() -> new EntityNotFoundException("플랫폼 설정이 존재하지 않습니다."));

        // 주문상태, 주문완료일 업데이트
        order.updateOrderStatus(order.getStatus());
        order.updateOrderedAt(order.getOrderedAt());


        Double discount = payDto.getAmount() * platformConfig.getPointRate(); // 3% platform_config 에서 가져오기
        Integer finalAmount = (int) (payDto.getAmount() - discount); // 최종금액(주문금액 - 할인금액)
        Pay pay = Pay.builder()
                .orderId(order.getId()) // 주문번호 order 객체로 가져오기
                .storeId(order.getStoreId()) // 매장번호 order 객체로 가져오기
                .ownerId(order.getOwnerId()) // 점주번호 order 객체로 가져오기
                .userId(order.getUserId()) // 고객번호 order 객체로 가져오기
                .amount(payDto.getAmount())
                .discountAmount(discount)
                .finalAmount(finalAmount)
                .build();
        Pay savedPay = payRepository.save(pay);

        // payLog 결제내역 insert
        // 결제 고유번호(savedPay - id 추출), 결제금액 finalAmount 2개 넣기
        PayLog payLog = PayLog.builder()
                .payId(savedPay.getId())
                .amount(payDto.getAmount())
                .discountAmount(discount)
                .finalAmount(finalAmount)
                .build();
        payLogRepository.save(payLog); // 곧바로 저장

        // point 포인트 insert
        // 결제 고유번호(savedPay - id 추출), 주문금액(finalAmount), 점주가 받을 포인트(discount)
        Point point = Point.builder()
                .payId(savedPay.getId())
                .storeId(savedPay.getStoreId()) // 결제에서 매장 고유번호
                .ownerId(savedPay.getOwnerId()) // 결제에서 점주 고유번호
                .orderPrice(finalAmount) //  주문금액
                .point(discount) // 점주 포인트
                .build();
        pointRepository.save(point); // 곧바로 저장

        // 점주의 포인트 (+) 하기
        member.addTotalPoint(discount);

        return PayDto.fromEntity(savedPay);
    }

    // 결제 전체 조회
    @Transactional(readOnly = true)
    public Page<PayDto> findAllPays(Pageable pageable) {
        Page<Pay> pays = payRepository.findAll(pageable);
        return pays.map(PayDto::fromEntity);
    }

    // 결제 상세 조회
    public PayDto findByPayId(Integer id){
        Pay pay = payRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 결제입니다"));
        return PayDto.fromEntity(pay);
    }

}
