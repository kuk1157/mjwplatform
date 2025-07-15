package com.pudding.base.domain.student.dto;


import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.student.entity.Student;
import com.pudding.base.domain.student.entity.StudentDetail;
import com.pudding.base.domain.student.enums.Health;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudentDetailDto {

    private Integer id;
    private Integer studentId;
    private String school;
    private Integer age;
    private String teacherName;
    private IsActive hasAssist;
    private Integer assistCount;
    private Health health;
    private IsActive hasDisease;
    private String diseaseName;
    private IsActive medication;
    private String medicationName;
    private String currentLevel;

    @Builder
    public StudentDetailDto(Integer id, Integer studentId, String school, Integer age, String teacherName, IsActive hasAssist, Integer assistCount,
                            Health health, IsActive hasDisease, String diseaseName, IsActive medication,
                            String medicationName, String currentLevel) {
        this.id = id;
        this.studentId = studentId;
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

    public static StudentDetailDto fromEntity(StudentDetail studentDetail) {
        return StudentDetailDto.builder()
                .id(studentDetail.getId())
                .studentId(studentDetail.getId())
                .school(studentDetail.getSchool())
                .age(studentDetail.getAge())
                .teacherName(studentDetail.getTeacherName())
                .hasAssist(studentDetail.getHasAssist())
                .assistCount(studentDetail.getAssistCount())
                .health(studentDetail.getHealth())
                .hasDisease(studentDetail.getHasDisease())
                .diseaseName(studentDetail.getDiseaseName())
                .medication(studentDetail.getMedication())
                .medicationName(studentDetail.getMedicationName())
                .currentLevel(studentDetail.getCurrentLevel())
                .build();
    }

    public StudentDetail toEntity(Student student) {
        return StudentDetail.builder()
                .student(student)
                .school(this.school)
                .age(this.age)
                .teacherName(this.teacherName)
                .hasAssist(this.hasAssist)
                .assistCount(this.assistCount)
                .health(this.health)
                .hasDisease(this.hasDisease)
                .diseaseName(this.diseaseName)
                .medication(this.medication)
                .medicationName(this.medicationName)
                .currentLevel(this.currentLevel)
                .build();
    }
}
