package com.pudding.base.domain.nftFailLog.repository;

import com.pudding.base.domain.nftFailLog.entity.NftFailLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NftFailLogRepository extends JpaRepository<NftFailLog, Integer> {


    @Query("""
        SELECT l FROM NftFailLog l WHERE
            l.errorCategory LIKE %:keyword% OR
            l.errorType LIKE %:keyword% OR
            l.koreanMsg LIKE %:keyword% OR
            l.errorMsg LIKE %:keyword%
    """)
    Page<NftFailLog> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
