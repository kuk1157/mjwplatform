package com.pudding.base.domain.visit.repository;

import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.visit.entity.VisitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitLogRepository extends JpaRepository<VisitLog, Integer> {
    List<VisitLog> findByStoreId(Integer storeNum);
    List<VisitLog> findByStoreIdAndVisitStatus(Integer storeNum, IsVisitStatus visitStatus);
}
