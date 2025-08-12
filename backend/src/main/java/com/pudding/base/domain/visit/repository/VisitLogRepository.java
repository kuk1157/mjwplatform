package com.pudding.base.domain.visit.repository;

import com.pudding.base.domain.common.enums.IsPaymentStatus;
import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.visit.entity.VisitLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitLogRepository extends JpaRepository<VisitLog, Integer> {

    List<VisitLog> findByCustomerId(Integer customerId, Sort sort);
    Page<VisitLog> findByCustomerId(Integer customerId, Pageable pageable);
    List<VisitLog> findByStoreId(Integer storeNum);
    List<VisitLog> findByStoreIdAndPaymentStatusAndVisitStatus(Integer storeNum, IsPaymentStatus paymentStatus, IsVisitStatus visitStatus);

}
