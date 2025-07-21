package com.pudding.base.domain.store.repository;

import com.pudding.base.domain.store.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRepository extends JpaRepository<Store, Integer> {
    Store findByOwnerId(Integer memberId);
}
