package com.pudding.base.domain.memberLog.repository;

import com.pudding.base.domain.common.dto.DateCount;
import com.pudding.base.domain.common.dto.SearchDateDto;
import com.pudding.base.domain.common.enums.ActType;
import com.pudding.base.domain.memberLog.entity.MemberLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MemberLogRepository extends JpaRepository<MemberLog, Integer> {
    // 접속 통계 날짜 검색
    long countByCreatedDateBetween(LocalDate start, LocalDate end);


    // 일별 (그대로 사용 가능)
    @Query("SELECT new com.pudding.base.domain.common.dto.DateCount(" +
            "p.createdDate, COUNT(p)) " +
            "FROM MemberLog p " +
            "WHERE p.createdDate BETWEEN :start AND :end " +
            "GROUP BY p.createdDate " +
            "ORDER BY p.createdDate")
    List<DateCount> countDaily(@Param("start") LocalDate start,
                               @Param("end") LocalDate end);

    // 월별
    @Query("SELECT new com.pudding.base.domain.common.dto.DateCount(" +
            "FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-', FUNCTION('MONTH', p.createdDate), '-01')), COUNT(p)) " +
            "FROM MemberLog p " +
            "WHERE p.createdDate BETWEEN :start AND :end " +
            "GROUP BY FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-', FUNCTION('MONTH', p.createdDate), '-01')) " +
            "ORDER BY FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-', FUNCTION('MONTH', p.createdDate), '-01'))")
    List<DateCount> countMonthly(@Param("start") LocalDate start,
                                 @Param("end") LocalDate end);

    // 년별
    @Query("SELECT new com.pudding.base.domain.common.dto.DateCount(" +
            "FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-01-01')), COUNT(p)) " +
            "FROM MemberLog p " +
            "WHERE p.createdDate BETWEEN :start AND :end " +
            "GROUP BY FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-01-01')) " +
            "ORDER BY FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-01-01'))")
    List<DateCount> countYearly(@Param("start") LocalDate start,
                                @Param("end") LocalDate end);
}
