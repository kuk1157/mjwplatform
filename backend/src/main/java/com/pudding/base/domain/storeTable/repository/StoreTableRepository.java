package com.pudding.base.domain.storeTable.repository;

import com.pudding.base.domain.storeTable.entity.StoreTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreTableRepository extends JpaRepository<StoreTable, Integer> {
    List<StoreTable> findByStoreId(Integer storeNum);
}
