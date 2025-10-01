
package com.pudding.base.domain.memberLog.service;
import com.pudding.base.domain.common.dto.SearchDateDto;
import java.time.LocalDate;
public interface MemberLogService {
    // 접속 통계 데이터
    SearchDateDto trafficCount(LocalDate start, LocalDate end);
}
