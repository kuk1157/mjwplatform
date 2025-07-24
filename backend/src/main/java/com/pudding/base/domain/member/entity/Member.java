package com.pudding.base.domain.member.entity;

import com.pudding.base.domain.auth.entity.Auth;
import com.pudding.base.domain.common.entity.BaseTimeEntity;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.member.enums.Gender;
import com.pudding.base.domain.member.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@DynamicInsert
@Table(name = "member")
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id; // 회원 번호 (PK)

    @Column(name = "login_id")
    private String loginId; // 로그인 ID

    @Column(name = "password")
    private String password; // 비밀번호

    @Column(name = "name")
    private String name; // 이름

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender; // 성별

    @Column(name = "birthday")
    private LocalDate birthday; // 생년월일

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "total_point", insertable = false, updatable = false)
    @Schema(description = "점주 합계 포인트")
    private Integer totalPoint; // point 테이블 INSERT 시 (+) , point_cash_out_request 테이블 insert 시 (-)

    @Column(name = "total_cash", insertable = false, updatable = false)
    @Schema(description = "점주 합계 현금")
    private Integer totalCash; // point_cash_out_request 테이블 insert 시 (+)




    @OneToOne(mappedBy = "member", cascade = CascadeType.REMOVE)
    private Auth auth;

    @Column(name = "is_active")
    @Enumerated(EnumType.STRING)
    private IsActive isActive; // 삭제 여부

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    public void prePersist() {
        super.prePersist();
        this.isActive = IsActive.y;
    }

    @Builder(toBuilder = true)
    public Member(String loginId, String password, String name, Gender gender,
                  LocalDate birthday, Role role, String email, String phoneNumber, IsActive isActive) {
        this.loginId = loginId;
        this.password = password;
        this.name = name;
        this.gender = gender;
        this.birthday = birthday;
        this.role = role;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.isActive = isActive;
    }

    public void updateRole(Role role) { this.role = role; }
    public void updateName(String name) { this.name = name; }
    public void updateGender(Gender gender) { this.gender = gender; }
    public void updateBirthday(LocalDate birthday) { this.birthday = birthday; }
    public void updateEmail(String email) { this.email = email; }
    public void updatePhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void updatePassword(String password) { this.password = password; }

    // point 테이블 INSERT 시 total_point 컬럼(+)
    public void addTotalPoint(double point){
        this.totalPoint += (int) point;
    }

    // point_cash_out_request 테이블 insert시 total_point 컬럼(-)
    public void useTotalPoint(int cash){
        if (cash <= 0) {
            throw new IllegalArgumentException("(-) 금액은 입력할 수 없습니다.");
        }
        this.totalPoint -= cash;
    }

    // point_cash_out_request 테이블 insert시 total_cash 컬럼(+)
    public void addTotalCash(int cash){
        this.totalCash += cash;
    }



    public void updateIsActive(IsActive isActive) {
        if(isActive == IsActive.n) {
            this.deletedAt = LocalDateTime.now();
        } else {
            this.deletedAt = null;
        }
        this.isActive = isActive;
    }
}