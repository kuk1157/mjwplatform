package com.pudding.base.domain.nftOnChainLog.repository;

import com.pudding.base.domain.nftOnChainLog.entity.NftOnChainLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NftOnChainLogRepository extends JpaRepository<NftOnChainLog, Integer> {


    @Query("""
        SELECT l FROM NftOnChainLog l WHERE
            l.onChainCategory LIKE %:keyword% OR
            l.errorType LIKE %:keyword% OR
            l.koreanMsg LIKE %:keyword% OR
            l.errorMsg LIKE %:keyword%
    """)
    Page<NftOnChainLog> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
