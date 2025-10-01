package com.pudding.base.domain.memberLog.repository;

import com.pudding.base.domain.memberLog.entity.MemberLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberLogRepository extends JpaRepository<MemberLog, Integer> {
}
