package com.pudding.base.domain.pointCashOutRequest.repository;
import com.pudding.base.domain.pointCashOutRequest.entity.PointCashOutRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PointCashOutRequestRepository extends JpaRepository<PointCashOutRequest, Integer> {
    Page<PointCashOutRequest> findByStoreIdAndOwnerId(Pageable pageable, Integer storeId, Integer ownerId);
}
