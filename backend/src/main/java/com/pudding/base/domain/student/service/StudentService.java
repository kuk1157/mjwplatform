package com.pudding.base.domain.student.service;

import com.pudding.base.domain.student.dto.StudentDto;
import com.pudding.base.domain.student.dto.StudentWrapperDto;

import java.util.List;

public interface StudentService {

    List<StudentDto> findAllStudents();
    List<StudentDto> findStudentByNameContaining(String name);

    StudentDto findStudentById(Integer id);

    StudentWrapperDto createStudent(String accessToken, StudentWrapperDto studentDto);

    StudentDto updateStudent(String accessToken, StudentDto studentDto);
    void deleteStudent(Integer id);
}