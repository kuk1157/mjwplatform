package com.pudding.base.domain.student.entity;

import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.student.enums.Health;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "student_detail")
public class StudentDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne()
    @JoinColumn(name = "student_id")
    private Student student; // 학생 엔티티와의 관계

    @Column(name = "school")
    private String school; // 학교/학년/반

    @Column(name = "age")
    private Integer age;

    @Column(name = "teacher_name", length = 50)
    private String teacherName; // 담임교사 이름

    @Column(name = "has_assist")
    @Enumerated(EnumType.STRING)
    private IsActive hasAssist; // 보조인력배치

    @Column(name = "assist_count")
    private Integer assistCount; // 보조인력 수

    @Column(name = "health")
    @Enumerated(EnumType.STRING)
    private Health health; // 건강상태 (good: 양호, poor: 허약)

    @Column(name = "has_disease")
    @Enumerated(EnumType.STRING)
    private IsActive hasDisease;

    @Column(name = "disease_name", length = 50)
    private String diseaseName; // 질병명

    @Column(name = "medication")
    @Enumerated(EnumType.STRING)
    private IsActive medication;

    @Column(name = "medication_name", length = 50)
    private String medicationName; // 약물명

    @Lob
    @Column(name = "current_level")
    private String currentLevel; // 학생의 현행 수준



    @Builder(toBuilder = true)
    public StudentDetail(Student student, String school, Integer age, String teacherName, IsActive hasAssist, Integer assistCount,
                         Health health, IsActive hasDisease, String diseaseName, IsActive medication,
                         String medicationName, String currentLevel) {
        this.student = student;
        this.school = school;
        this.age = age;
        this.teacherName = teacherName;
        this.hasAssist = hasAssist;
        this.assistCount = assistCount;
        this.health = health;
        this.hasDisease = hasDisease;
        this.diseaseName = diseaseName;
        this.medication = medication;
        this.medicationName = medicationName;
        this.currentLevel = currentLevel;
    }

    public void updateSchool(String school) {
        if (school != null) this.school = school;
    }

    public void updateAge(Integer age) {
        if (age != null) this.age = age;
    }
}