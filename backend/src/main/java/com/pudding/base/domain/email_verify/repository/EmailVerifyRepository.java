package com.pudding.base.domain.email_verify.repository;

import com.pudding.base.domain.email_verify.entity.EmailVerify;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailVerifyRepository extends JpaRepository<EmailVerify, Integer> {
    Optional<EmailVerify> findTopByEmailOrderByCreatedAtDesc(String email);

    @Query("SELECT ev FROM EmailVerify ev WHERE ev.email = :email AND ev.createdAt > :createdAt ORDER BY ev.createdAt DESC")
    Optional<EmailVerify> findRecentEmailVerify(String email, LocalDateTime createdAt);
}
