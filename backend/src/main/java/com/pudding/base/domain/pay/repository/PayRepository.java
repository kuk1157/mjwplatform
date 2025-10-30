package com.pudding.base.domain.pay.repository;
import com.pudding.base.domain.common.dto.PriceCount;
import com.pudding.base.domain.pay.entity.Pay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PayRepository extends JpaRepository<Pay, Integer>{



    // 결제 불가 로직 쿼리(방문일 기준으로 조회하기)
    @Query("""
        SELECT COUNT(v)
        FROM VisitLog v
        WHERE v.customerId = :customerId
        AND v.storeId = :storeId
        AND v.visitStatus = 'Y'
        AND v.paymentStatus = 'Y'
        AND v.createdAt >= :start
        AND v.createdAt < :end
    """)
    Integer countTodayPayments(@Param("customerId") Integer customerId,
                               @Param("storeId") Integer storeId,
                               @Param("start") LocalDateTime start,
                               @Param("end") LocalDateTime end);

    // 하루 총합주문금액 한도 100만원 확인용 쿼리
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Pay p WHERE DATE(p.createdAt) = CURRENT_DATE")
    Integer getTodayTotalPoint();

    boolean existsByVisitLogId(Integer visitLogId);


    // 점주 기준 결제 조회
    Page<Pay> findAllByOwnerId(Pageable pageable, Integer ownerId);

    // 고객 기준 결제 조회
    Page<Pay> findAllByCustomerId(Pageable pageable, Integer customerId);

    // 고객(모바일) 기준 3가지 금액 통계
    @Query("SELECT new com.pudding.base.domain.common.dto.PriceCount(" +
            "SUM(p.amount), SUM(p.discountAmount), SUM(p.finalAmount)) " +
            "FROM Pay p WHERE p.customerId = :customerId")
    PriceCount getCustomerByPayTotal(@Param("customerId") Integer customerId);
}
