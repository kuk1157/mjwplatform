package com.pudding.base.domain.student.service;

import com.pudding.base.domain.member.service.MemberService;
import com.pudding.base.domain.student.dto.StudentDetailDto;
import com.pudding.base.domain.student.dto.StudentDto;
import com.pudding.base.domain.student.dto.StudentWrapperDto;
import com.pudding.base.domain.student.entity.Student;
import com.pudding.base.domain.student.entity.StudentDetail;
import com.pudding.base.domain.student.exception.StudentNotFoundException;
import com.pudding.base.domain.student.repository.StudentDetailRepository;
import com.pudding.base.domain.student.repository.StudentRepository;
import com.pudding.base.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentDetailRepository studentDetailRepository;
    private final MemberService memberService;
    private final JwtUtil jwtTokenProvider;




    @Transactional(readOnly = true)
    @Override
    public List<StudentDto> findAllStudents() {
        return studentRepository.findAll().stream()
                .map(StudentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public StudentDto findStudentById(Integer id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("학생을 찾을 수 없습니다."));
        return StudentDto.fromEntity(student);
    }
    @Transactional(readOnly = true)
    @Override
    public List<StudentDto> findStudentByNameContaining(String name) {
        List<Student> students = studentRepository.findByNameContaining(name);

        if (students.isEmpty()) {
            throw new StudentNotFoundException("학생을 찾을 수 없습니다.");
        }

        return students.stream()
                .map(StudentDto::fromEntity)
                .collect(Collectors.toList());
    }
    @Transactional
    @Override
    public StudentWrapperDto createStudent(String accessToken, StudentWrapperDto studentDto) {
        Integer id = this.jwtTokenProvider.getUserId(accessToken.substring(7));
//        MemberDto member = this.memberService.findById(id);

        StudentDto studentBuilder = StudentDto.builder()
                .creatorId(id)
                .name(studentDto.getStudent().getName())
                .birthday(studentDto.getStudent().getBirthday())
                .gender(studentDto.getStudent().getGender())
                .disableType(studentDto.getStudent().getDisableType())
                .disableDegree(studentDto.getStudent().getDisableDegree())
                .build();
        Student student = studentRepository.save(studentBuilder.toEntity());

        StudentDetailDto studentDetailBuilder = StudentDetailDto.builder()
                .studentId(student.getId())
                .school(studentDto.getSchool())
                .age(studentDto.getAge())
                .teacherName(studentDto.getTeacherName())
                .hasAssist(studentDto.getHasAssist())
                .assistCount(studentDto.getAssistCount())
                .health(studentDto.getHealth())
                .hasDisease(studentDto.getHasDisease())
                .diseaseName(studentDto.getDiseaseName())
                .medication(studentDto.getMedication())
                .medicationName(studentDto.getMedicationName())
                .currentLevel(studentDto.getCurrentLevel())
                .build();
        StudentDetail studentDetail = studentDetailRepository.save(studentDetailBuilder.toEntity(student));
        return StudentWrapperDto.fromEntity(studentDetail);
    }
    @Transactional
    @Override
    public StudentDto updateStudent(String accessToken, StudentDto studentDto) {
        Student student = studentRepository.findById(studentDto.getId())
                .orElseThrow(() -> new StudentNotFoundException("학생을 찾을 수 없습니다."));

        student.updateName(studentDto.getName());
        student.updateBirthday(studentDto.getBirthday());
        student.updateGender(studentDto.getGender());
        student.updateDisableType(studentDto.getDisableType());
        student.updateDisableDegree(studentDto.getDisableDegree());

        studentRepository.save(student);

        return StudentDto.fromEntity(student);
    }
    @Transactional
    @Override
    public void deleteStudent(Integer id) {
        studentRepository.deleteById(id);
    }
}