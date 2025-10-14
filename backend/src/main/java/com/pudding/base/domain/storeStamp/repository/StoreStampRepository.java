package com.pudding.base.domain.storeStamp.repository;

import com.pudding.base.domain.storeStamp.entity.StoreStamp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreStampRepository extends JpaRepository<StoreStamp, Integer> {
    // 가맹점 스탬프 중복 체크
    boolean existsByStoreIdAndCustomerId(Integer storeId, Integer customerId);
}
