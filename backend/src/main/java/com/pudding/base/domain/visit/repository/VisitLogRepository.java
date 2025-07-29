package com.pudding.base.domain.visit.repository;

import com.pudding.base.domain.visit.entity.VisitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitLogRepository extends JpaRepository<VisitLog, Integer> {
}
