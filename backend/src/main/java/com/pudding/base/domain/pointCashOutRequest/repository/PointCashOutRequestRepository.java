package com.pudding.base.domain.pointCashOutRequest.repository;
import com.pudding.base.domain.common.dto.PriceCount;
import com.pudding.base.domain.pointCashOutRequest.entity.PointCashOutRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PointCashOutRequestRepository extends JpaRepository<PointCashOutRequest, Integer> {
    Page<PointCashOutRequest> findByStoreId(Integer storeId, Pageable pageable);

    // 일별 (그대로 사용 가능)
    @Query("SELECT new com.pudding.base.domain.common.dto.PriceCount(" +
            "p.createdDate, COUNT(p), SUM(p.cash), AVG(p.cash), MIN(p.cash), MAX(p.cash)) " +
            "FROM PointCashOutRequest p " +
            "WHERE p.createdDate BETWEEN :start AND :end " +
            "GROUP BY p.createdDate " +
            "ORDER BY p.createdDate")
    List<PriceCount> countDaily(@Param("start") LocalDate start,
                                @Param("end") LocalDate end);

    // 월별
    @Query("SELECT new com.pudding.base.domain.common.dto.PriceCount(" +
            "FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-', FUNCTION('MONTH', p.createdDate), '-01')), COUNT(p), SUM(p.cash), AVG(p.cash), MIN(p.cash), MAX(p.cash)) " +
            "FROM PointCashOutRequest p " +
            "WHERE p.createdDate BETWEEN :start AND :end " +
            "GROUP BY FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-', FUNCTION('MONTH', p.createdDate), '-01')) " +
            "ORDER BY FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-', FUNCTION('MONTH', p.createdDate), '-01'))")
    List<PriceCount> countMonthly(@Param("start") LocalDate start,
                                  @Param("end") LocalDate end);

    // 년별
    @Query("SELECT new com.pudding.base.domain.common.dto.PriceCount(" +
            "FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-01-01')), COUNT(p), SUM(p.cash), AVG(p.cash), MIN(p.cash), MAX(p.cash)) " +
            "FROM PointCashOutRequest p " +
            "WHERE p.createdDate BETWEEN :start AND :end " +
            "GROUP BY FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-01-01')) " +
            "ORDER BY FUNCTION('DATE', CONCAT(FUNCTION('YEAR', p.createdDate), '-01-01'))")
    List<PriceCount> countYearly(@Param("start") LocalDate start,
                                 @Param("end") LocalDate end);


    // 총 데이터에 대한 4가지 금액
    @Query("SELECT new com.pudding.base.domain.common.dto.PriceCount(" +
            "SUM(p.cash), AVG(p.cash), MIN(p.cash), MAX(p.cash)) " +
            "FROM PointCashOutRequest p")
    PriceCount getCashTotal();

}
