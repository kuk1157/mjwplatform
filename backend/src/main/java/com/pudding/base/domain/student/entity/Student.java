package com.pudding.base.domain.student.entity;

import com.pudding.base.domain.common.entity.BaseTimeEntity;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.student.enums.DisableDegree;
import com.pudding.base.domain.student.enums.Gender;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "student")
public class Student extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "creator_id")
    private Integer creatorId;

    @Column(name = "name")
    private String name; // 이름

    @Column(name = "birthday")
    private LocalDate birthday; // 생년월일

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender; // 성별

    @Column(name = "disable_type")
    private String disableType;

    @Column(name = "disable_degree")
    @Enumerated(EnumType.STRING)
    private DisableDegree disableDegree;

    @Column(name = "is_active")
    @Enumerated(EnumType.STRING)
    private IsActive isActive; // 삭제 여부
    @PrePersist
    public void prePersist() {
        super.prePersist();
        this.isActive = IsActive.y;
    }
    @Builder
    public Student(Integer creatorId, String name, LocalDate birthday,
                   Gender gender, String disableType, DisableDegree disableDegree, IsActive isActive) {
        this.creatorId = creatorId;
        this.name = name;
        this.birthday = birthday;
        this.gender = gender;
        this.disableType = disableType;
        this.disableDegree = disableDegree;
        this.isActive = isActive;
    }
    public void updateName(String name) {
        if (name != null) this.name = name;
    }

    public void updateBirthday(LocalDate birthday) {
        if (birthday != null) this.birthday = birthday;
    }

    public void updateGender(Gender gender) {
        if (gender != null) this.gender = gender;
    }

    public void updateDisableType(String disableType) {
        if (disableType != null) this.disableType = disableType;
    }

    public void updateDisableDegree(DisableDegree disableDegree) {
        if (disableDegree != null) this.disableDegree = disableDegree;
    }
}