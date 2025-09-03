package com.pudding.base.domain.pay.service;

import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.repository.MemberRepository;
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
import com.pudding.base.domain.visit.entity.VisitLog;
import com.pudding.base.domain.visit.repository.VisitLogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PayServiceImpl implements PayService {

    private final PayRepository payRepository;
    private final PayLogRepository payLogRepository; // 결제내역 기본 jpa 리포지터리 가져오기
    private final PointRepository pointRepository; // 포인트 기본 jpa 리포지터리 가져오기
    private final OrderRepository orderRepository; // 주문 기본 jpa 리포지터리 가져오기
    private final MemberRepository memberRepository; // 회원 기본 jpa 리포지터리 가져오기
    private final PlatformConfigRepository platformConfigRepository; // 플랫폼 설정 기본 jpa 리포지터리 가져오기
    private final VisitLogRepository visitLogRepository;

    // 결제 등록
    @Transactional
    public PayDto createPay(PayDto.Request payDto, Integer visitLogId){

        // 방문(주문)과 결제는 1대1 매칭되어야 하기때문에 체크필요함.
        boolean exists = payRepository.existsByVisitLogId(visitLogId);
        if (exists) {
            throw new CustomException("이미 결제가 등록된 방문(주문)입니다.");
        }

        // 방문(주문) 정보 가져오기 (visitLogId로 방문 테이블 조회)
        VisitLog visitLog = visitLogRepository.findById(visitLogId).orElseThrow(() -> new CustomException("존재하지 않는 방문 기록입니다."));

        // 방문(주문)상태가 대기일 경우에만 결제처리 되도록 - 위에서 1대1 무조건 막히지만, 혹시 몰라서 2차로 방어
        if (visitLog.getVisitStatus() == IsVisitStatus.y) {
            throw new CustomException("이미 결제처리가 완료된 방문(주문)은 결제 처리를 할 수 없습니다..");
        }


        // [결제 불가 로직 시작]
        LocalDate visitDate = visitLog.getCreatedAt().toLocalDate();
        LocalDateTime start = visitDate.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        Integer count = payRepository.countTodayPayments(visitLog.getCustomerId(), visitLog.getStoreId(),  start, end);

        if (count != null && count > 0) {
            throw new CustomException("해당 방문일에 이미 동일 고객 결제처리하였습니다.");
        }

        // 방문일 범위의 모든 로그 조회
        List<VisitLog> visitLogsOfThatDay = visitLogRepository.findByCustomerIdAndCreatedAtBetween(
                visitLog.getCustomerId(), start, end
        );

        // 방문기록 업데이트 로직
        for (VisitLog v : visitLogsOfThatDay) {
            if (v.getId().equals(visitLog.getId())) {
                v.updateVisitStatus();        // visitStatus = Y
                v.updatePaymentStatus();      // paymentStatus = Y
                v.updateAmountEnteredAt();    // 금액 입력 시간 기록
            } else {
                v.updatePaymentStatus(); // paymentStatus = Y
            }
        }





        // 회원 정보 가져오기(visitLog.getOwnerId로 member 테이블 조회)
        Member member = memberRepository.findById(visitLog.getOwnerId()).orElseThrow(() -> new CustomException("존재하지 않는 점주입니다."));

        // 플랫폼 설정 정보 가져오기
        PlatformConfig platformConfig = platformConfigRepository.findById(1).orElseThrow(() -> new CustomException("플랫폼 설정이 존재하지 않습니다."));


//        // 최대 금액 100만원
//        Integer maxPoint = platformConfig.getMaxStorePrice();
//
//        // 오늘 총 적립 포인트
//        Integer todayTotalPoint = payRepository.getTodayTotalPoint();
//
//
//        int remainQuota = Math.max(0, maxPoint - todayTotalPoint);
//        int pointToSave = Math.min(remainQuota, payDto.getAmount());
//
//        if (todayTotalPoint + payDto.getAmount() > 1_000_000) {
//            throw new IllegalArgumentException("일일 포인트 적립 한도를 초과하여 결제를 진행할 수 없습니다.");
//        }

        // 방문(주문)상태, 방문(주문)완료일 업데이트
        visitLog.updateVisitStatus();
        visitLog.updateAmountEnteredAt();


        Double discount = payDto.getAmount() * platformConfig.getPointRate(); // 3% platform_config 에서 가져오기
        Integer finalAmount = (int) (payDto.getAmount() - discount); // 최종금액(주문금액 - 할인금액)
        Pay pay = Pay.builder()
                .visitLogId(visitLog.getId()) // 주문번호 visitLog 객체로 가져오기
                .storeId(visitLog.getStoreId()) // 매장번호 visitLog 객체로 가져오기
                .ownerId(visitLog.getOwnerId()) // 점주번호 visitLog 객체로 가져오기
                .customerId(visitLog.getCustomerId()) // 고객번호 visitLog 객체로 가져오기
                .amount(payDto.getAmount())
                .discountAmount(discount)
                .finalAmount(finalAmount)
                .build();
        Pay savedPay = payRepository.save(pay);
        // payLog 결제내역 insert
        // 결제 고유번호(savedPay - id 추출), 결제금액 finalAmount 2개 넣기
        PayLog payLog = PayLog.builder()
                .payId(savedPay.getId())
                .ownerId(savedPay.getOwnerId()) // 결제에서 점주 고유번호
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
        Pay pay = payRepository.findById(id).orElseThrow(() -> new CustomException("존재하지 않는 결제입니다"));
        return PayDto.fromEntity(pay);
    }

    // 점주 기준 결제 조회
    public Page<PayDto> findByOwnerId(Pageable pageable, Integer ownerId) {
        Page<Pay> pays = payRepository.findAllByOwnerId(pageable, ownerId);
        return pays.map(PayDto::fromEntity);
    }

}
