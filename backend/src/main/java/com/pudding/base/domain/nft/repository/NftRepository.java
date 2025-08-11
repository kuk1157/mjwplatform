package com.pudding.base.domain.nft.repository;

import com.pudding.base.domain.nft.entity.Nft;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NftRepository extends JpaRepository<Nft, Integer> {
    Page<Nft> findByCustomerId(Integer customerId, Pageable pageable);
    List<Nft> findByCustomerId(Integer customerId, Sort sort);
    boolean existsByStoreIdAndCustomerId(Integer storeId, Integer customerId);
}
