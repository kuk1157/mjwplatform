package com.pudding.base.domain.payLog.repository;
import com.pudding.base.domain.payLog.entity.PayLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayLogRepository extends JpaRepository<PayLog, Long> {
}
