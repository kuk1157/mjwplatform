package com.pudding.base.domain.storeStamp.repository;

import com.pudding.base.domain.storeStamp.entity.StoreStamp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreStampRepository extends JpaRepository<StoreStamp, Integer> {
    // 가맹점 스탬프 중복 체크
    boolean existsByCustomerIdAndStoreId(Integer customerId, Integer storeId);

    // 고객의 스탬프 개수 체크
    // 고객 등급 업그레이드 체크, 쿠폰 발급 대상 체크 용도
    Integer countByCustomerId(Integer customerId);

    // 고객 매장 방문 스탬프 조회
    List<StoreStamp> findCustomerId(Integer customerId);
}
