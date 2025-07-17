package com.pudding.base.domain.payLog.repository;
import com.pudding.base.domain.payLog.entity.PayLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayLogRepository extends JpaRepository<PayLog, Long> {
}
