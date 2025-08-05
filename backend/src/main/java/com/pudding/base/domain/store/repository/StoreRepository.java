package com.pudding.base.domain.store.repository;

import com.pudding.base.domain.store.dto.StoreDto;
import com.pudding.base.domain.store.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRepository extends JpaRepository<Store, Integer> {
    Store findByOwnerId(Integer memberId);


    // 점주명 불러오기 위한 join문 - 매장 전체조회
    @Query("""
        SELECT new com.pudding.base.domain.store.dto.StoreDto(
            s.id, s.ownerId, s.name, s.address, m.name, s.createdAt
        )
        FROM Store s
        JOIN Member m ON s.ownerId = m.id
        WHERE (:keyword IS NULL OR 
               LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
               LOWER(s.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
               LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    Page<StoreDto> findByStoreSearch(Pageable pageable, @Param("keyword") String keyword);


    // 점주명 불러오기 위한 join문 - 매장 상세조회
    @Query("""
        SELECT new com.pudding.base.domain.store.dto.StoreDto(
            s.id, s.ownerId, s.name, s.address, m.name, s.createdAt
        )
        FROM Store s
        JOIN Member m ON s.ownerId = m.id
        WHERE s.id = :id
    """)
    StoreDto findByStoreIdSearch(@Param("id") Integer id);


    // 점주명 불러오기 위한 join문 - 매장 상세조회(ownerId 기준으로)
    // 메인 대시보드 용도
    @Query("""
        SELECT new com.pudding.base.domain.store.dto.StoreDto(
            s.id, s.ownerId, s.name, s.address, m.name, s.createdAt
        )
        FROM Store s
        JOIN Member m ON s.ownerId = m.id
        WHERE s.ownerId = :ownerId
    """)
    StoreDto findByOwnerIdSearch(@Param("ownerId") Integer ownerId);



}
