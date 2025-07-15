package com.pudding.base.domain.student.dto;

import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.student.entity.Student;
import com.pudding.base.domain.student.enums.DisableDegree;
import com.pudding.base.domain.student.enums.Gender;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudentDto {

    private Integer id;
    private Integer creatorId;
    private String name;
    private LocalDate birthday;
    private Gender gender;
    private String disableType;
    private DisableDegree disableDegree;
    private IsActive isActive;

    @Builder(toBuilder = true)
    public StudentDto(Integer id, Integer creatorId, String name, LocalDate birthday,
                      Gender gender, String disableType, DisableDegree disableDegree, IsActive isActive) {
        this.id = id;
        this.creatorId = creatorId;
        this.name = name;
        this.birthday = birthday;
        this.gender = gender;
        this.disableType = disableType;
        this.disableDegree = disableDegree;
        this.isActive = isActive;
    }

    public static StudentDto fromEntity(Student student) {
        return StudentDto.builder()
                .id(student.getId())
                .creatorId(student.getCreatorId())
                .name(student.getName())
                .birthday(student.getBirthday())
                .gender(student.getGender())
                .disableType(student.getDisableType())
                .disableDegree(student.getDisableDegree())
                .isActive(student.getIsActive())
                .build();
    }

    public Student toEntity() {
        return Student.builder()
                .creatorId(this.creatorId)
                .name(this.name)
                .birthday(this.birthday)
                .gender(this.gender)
                .disableType(this.disableType)
                .disableDegree(this.disableDegree)
                .isActive(this.isActive)
                .build();
    }

}