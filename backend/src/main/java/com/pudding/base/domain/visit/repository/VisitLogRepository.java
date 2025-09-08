package com.pudding.base.domain.visit.repository;

import com.pudding.base.domain.common.enums.IsPaymentStatus;
import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.visit.dto.VisitLogDto;
import com.pudding.base.domain.visit.entity.VisitLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitLogRepository extends JpaRepository<VisitLog, Integer> {


    @Query("SELECT new com.pudding.base.domain.visit.dto.VisitLogDto(" +
            "v.id, v.ownerId, v.storeId, v.storeTableId, v.customerId, v.storeName, m.name, v.visitStatus, v.paymentStatus, v.createdAt) " +
            "FROM VisitLog v " +
            "JOIN Customer c ON c.id = v.customerId " +
            "JOIN Member m ON m.id = c.memberId " +
            "WHERE v.storeId = :storeNum")
    List<VisitLogDto> findByAllVisitLog(@Param("storeNum") Integer storeNum);

    List<VisitLog> findByCustomerId(Integer customerId, Sort sort);
    Page<VisitLog> findByCustomerId(Integer customerId, Pageable pageable);
    List<VisitLog> findByStoreId(Integer storeNum);


    // 최신 신규 방문 memberName 뽑아오기
    @Query("SELECT new com.pudding.base.domain.visit.dto.VisitLogDto(" +
            "v.id, v.ownerId, v.storeId, v.storeTableId, v.customerId, v.storeName, m.name, v.visitStatus, v.paymentStatus, v.createdAt) " +
            "FROM VisitLog v " +
            "JOIN Customer c ON c.id = v.customerId " +
            "JOIN Member m ON m.id = c.memberId " +
            "WHERE v.storeId = :storeNum " +
            "AND v.paymentStatus = 'N' " +
            "AND v.visitStatus = 'N'")
    List<VisitLogDto> findUnpaidAndUnvisitedByStoreId(@Param("storeNum") Integer storeNum);

    // 방문기록 결제 처리 전에는 안쌓이게끔 하는 쿼리
    @Query("SELECT COUNT(v) FROM VisitLog v WHERE v.paymentStatus = 'N' AND v.visitStatus = 'N' AND v.storeId = :storeId AND v.customerId = :customerId")
    Integer findByVisitCount(@Param("storeId") Integer storeId, @Param("customerId") Integer customerId);

    // 기존 신규방문
    List<VisitLog> findByStoreIdAndPaymentStatusAndVisitStatus(Integer storeNum, IsPaymentStatus paymentStatus, IsVisitStatus visitStatus);

    List<VisitLog> findByCustomerIdAndCreatedAtBetween(Integer customerId, LocalDateTime start, LocalDateTime end);
}
