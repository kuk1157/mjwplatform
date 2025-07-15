package com.pudding.base.domain.auth.repository;

import com.pudding.base.domain.auth.entity.Auth;
import com.pudding.base.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<Auth, Integer> {
    boolean existsByMember(Member member);

    boolean existsByMemberAndMemberRole(Member member, String role);

    Optional<Auth> findByAccessToken(String accessToken);

    // Refresh Token으로 인증 엔티티 검색
    Optional<Auth> findByRefreshToken(String refreshToken);
}