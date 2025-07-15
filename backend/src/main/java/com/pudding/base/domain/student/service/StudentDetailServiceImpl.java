package com.pudding.base.domain.student.service;

import com.pudding.base.domain.student.dto.StudentDetailDto;
import com.pudding.base.domain.student.dto.StudentWrapperDto;
import com.pudding.base.domain.student.entity.Student;
import com.pudding.base.domain.student.entity.StudentDetail;
import com.pudding.base.domain.student.exception.StudentNotFoundException;
import com.pudding.base.domain.student.repository.StudentDetailRepository;
import com.pudding.base.domain.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentDetailServiceImpl implements StudentDetailService {
    private final StudentDetailRepository studentDetailRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    @Override
    public List<StudentWrapperDto> findAllStudentDetails() {
        return studentDetailRepository.findLatestDetailsForAllStudents().stream()
                .map(StudentWrapperDto::fromEntity)
                .collect(Collectors.toList());
    }
    /*
    * id 리스트로 student+student_detail 정보 반환
    *
    * */
    @Transactional(readOnly = true)
    @Override
    public List<StudentWrapperDto> findStudentDetailsByStudentName(String name) {
        List<StudentDetail> studentDetails = studentDetailRepository.findByStudentNameContaining(name);

        return studentDetails.stream()
                .map(StudentWrapperDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public StudentWrapperDto updateStudentDetail(String accessToken, StudentWrapperDto studentWrapperDto) {
        StudentDetail student = studentDetailRepository.findByStudentId(studentWrapperDto.getStudent().getId());
        StudentDetail studentDetail = studentDetailRepository.save(studentWrapperDto.toEntity(student));
        return StudentWrapperDto.fromEntity(studentDetail);
    }
    @Transactional
    @Override
    public StudentWrapperDto createStudentDetail(String accessToken, StudentDetailDto studentDetailDto) {
        Student student = studentRepository.findById(studentDetailDto.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException("학생을 찾을 수 없습니다."));
        StudentDetail studentDetail = studentDetailRepository.save(studentDetailDto.toEntity(student));
        return StudentWrapperDto.fromEntity(studentDetail);
    }

    @Transactional
    @Override
    public void deleteStudentDetail(Integer id) {
        studentDetailRepository.deleteById(id);
    }
}