package com.pudding.base.domain.member.repository;

import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.member.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    @Operation(summary = "로그인 아이디로 회원 조회", description = "로그인 시 로그인 아이디로 회원 단일 조회")
    @Parameter(name = "login_id", description = "회원의 로그인 아이디", required = true)
    Member findByLoginIdAndIsActive(String loginId, IsActive isActive);
    Member findByEmailAndIsActive(String email, IsActive isActive);
    @Query("SELECT m FROM Member m WHERE " +
            "(:keyword IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.loginId) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:name IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:loginId IS NULL OR LOWER(m.loginId) LIKE LOWER(CONCAT('%', :loginId, '%')))" +
            "AND (m.isActive = 'y')"
    )
    Page<Member> findMembers(
            Pageable pageable,
            @Param("keyword") String keyword,
            @Param("name") String name,
            @Param("loginId") String loginId
    );

    Optional<Member> findByDid(String did);
}