package com.pudding.base.domain.customer.entity;

import com.pudding.base.domain.common.enums.IsActive;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;


@DynamicInsert
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="customer") // 고객 테이블
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "did")
    @Schema(description = "did")
    private String did;

    @Column(name = "member_id")
    @Schema(description = "로그인 계정 고유번호")
    private Integer memberId;

    @Column(name = "is_active")
    @Enumerated(EnumType.STRING)
    @Schema(description = "활성화 여부")
    private IsActive isActive;


    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;


    @Builder
    public Customer(Integer id, String did, IsActive isActive, LocalDateTime createdAt){
        this.id = id;
        this.did = did;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }



}
