package com.pudding.base.domain.storeTable.repository;

import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.storeTable.entity.StoreTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreTableRepository extends JpaRepository<StoreTable, Integer> {
    List<StoreTable> findByStoreId(Integer storeId);


    @Query("SELECT COALESCE(MAX(st.tableNumber), 0) + 1 FROM StoreTable st WHERE st.storeId = :storeId")
    Integer findTableNumberByStoreId(@Param("storeId") Integer storeId);
}
