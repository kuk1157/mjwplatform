package com.pudding.base.domain.student.service;

import com.pudding.base.domain.student.dto.StudentDetailDto;
import com.pudding.base.domain.student.dto.StudentWrapperDto;

import java.util.List;

public interface StudentDetailService {

    List<StudentWrapperDto> findAllStudentDetails();

    List<StudentWrapperDto> findStudentDetailsByStudentName(String name);

    StudentWrapperDto createStudentDetail(String accessToken, StudentDetailDto studentResponseDto);
    StudentWrapperDto updateStudentDetail(String accessToken, StudentWrapperDto studentWrapperDto);

    void deleteStudentDetail(Integer id);
}