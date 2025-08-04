package com.pudding.base.domain.pay.repository;
import com.pudding.base.domain.pay.entity.Pay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PayRepository extends JpaRepository<Pay, Integer>{
    @Query("SELECT COUNT(p) FROM Pay p WHERE p.customerId = :customerId AND p.createdAt >= :start AND p.createdAt < :end")
    Integer countTodayPayments(@Param("customerId") Integer customerId,
                               @Param("start") LocalDateTime start,
                               @Param("end") LocalDateTime end);

    // 하루 총합주문금액 한도 100만원 확인용 쿼리
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Pay p WHERE DATE(p.createdAt) = CURRENT_DATE")
    Integer getTodayTotalPoint();

    boolean existsByVisitLogId(Integer visitLogId);
}
