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

import java.util.List;

@Repository
public interface VisitLogRepository extends JpaRepository<VisitLog, Integer> {


    @Query("SELECT new com.pudding.base.domain.visit.dto.VisitLogDto(" +
            "v.id, v.ownerId, v.storeId, v.storeTableId, v.customerId, v.storeName, m.name, v.createdAt) " +
            "FROM VisitLog v " +
            "JOIN Customer c ON c.id = v.customerId " +
            "JOIN Member m ON m.id = c.memberId " +
            "WHERE v.storeId = :storeNum")
    List<VisitLogDto> findByAllVisitLog(@Param("storeNum") Integer storeNum);

    List<VisitLog> findByCustomerId(Integer customerId, Sort sort);
    Page<VisitLog> findByCustomerId(Integer customerId, Pageable pageable);
    List<VisitLog> findByStoreId(Integer storeNum);
    List<VisitLog> findByStoreIdAndPaymentStatusAndVisitStatus(Integer storeNum, IsPaymentStatus paymentStatus, IsVisitStatus visitStatus);

}
