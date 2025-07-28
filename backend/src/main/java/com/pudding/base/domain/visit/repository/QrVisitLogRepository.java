package com.pudding.base.domain.visit.repository;

import com.pudding.base.domain.visit.entity.QrVisitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QrVisitLogRepository extends JpaRepository<QrVisitLog, Integer> {
}
