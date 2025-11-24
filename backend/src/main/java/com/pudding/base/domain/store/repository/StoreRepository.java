package com.pudding.base.domain.store.repository;

import com.pudding.base.domain.member.dto.MemberDto;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.store.dto.StoreDto;
import com.pudding.base.domain.store.entity.Store;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<Store, Integer> {
    Store findByOwnerId(Integer memberId);


    // 점주명 불러오기 위한 join문 - 매장 전체조회
    @Query("""
        SELECT new com.pudding.base.domain.store.dto.StoreDto(
            s.id, s.ownerId, s.name, s.address, s.latitude, s.longitude, s.grade, s.thumbnail, s.extension, m.name, s.createdAt
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
            s.id, s.ownerId, s.name, s.address, s.latitude, s.longitude, s.grade, s.thumbnail, s.extension, m.name, s.createdAt
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
            s.id, s.ownerId, s.name, s.address, s.latitude, s.longitude, s.grade, s.thumbnail, s.extension, m.name, s.createdAt
        )
        FROM Store s
        JOIN Member m ON s.ownerId = m.id
        WHERE s.ownerId = :ownerId
    """)
    StoreDto findByOwnerIdSearch(@Param("ownerId") Integer ownerId);


    // 가맹점 생성시 점주 선택 예외처리
    boolean existsByOwnerId(@NotNull(message = "점주를 선택해주세요.") Integer ownerId);

    // 페이지에서 가맹점 보유 여부 미리 체크하기 위한 쿼리
    @Query("""
        SELECT m 
        FROM Member m 
        WHERE m.role = 'owner'
          AND m.isActive = 'Y'
          AND NOT EXISTS (
              SELECT 1 FROM Store s WHERE s.ownerId = m.id
          )
    """)
    List<Member> findAvailableOwners();

    // 매장 수정시 매장이름 중복체크
    boolean existsByName(@NotNull(message = "매장 이름을 입력해주세요.") String name);

    boolean existsByNameAndIdNot(String name, Integer id);
}
