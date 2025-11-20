package com.pudding.base.domain.loginFailLog.repository;


import com.pudding.base.domain.loginFailLog.entity.LoginFailLog;
import com.pudding.base.domain.nftOnChainLog.entity.NftOnChainLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginFailLogRepository extends JpaRepository<LoginFailLog, Integer> {
    @Query("""
        SELECT l FROM LoginFailLog l WHERE
            l.failType LIKE %:keyword% OR
            l.message LIKE %:keyword%
    """)
    Page<LoginFailLog> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
