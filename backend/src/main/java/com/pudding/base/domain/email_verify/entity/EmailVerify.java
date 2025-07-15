package com.pudding.base.domain.email_verify.entity;

import com.pudding.base.domain.common.entity.BaseTimeEntity;
import com.pudding.base.domain.email_verify.enums.IsVerify;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "email_verify")
public class EmailVerify extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "email")
    private String email;

    @Column(name = "number")
    private String number;

    @Column(name = "is_verify")
    @Enumerated(EnumType.STRING)
    private IsVerify isVerify;

    @PrePersist
    public void prePersist() {
        super.prePersist();
        this.isVerify = IsVerify.n;
    }

    @Builder(toBuilder = true)
    public EmailVerify(String email, String number) {
        this.email = email;
        this.number = number;
    }

    public void updateIsVerify(IsVerify isVerify) {
        this.isVerify = isVerify;
    }
}