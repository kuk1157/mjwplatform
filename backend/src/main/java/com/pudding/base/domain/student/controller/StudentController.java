package com.pudding.base.domain.student.controller;

import com.pudding.base.domain.student.dto.StudentDetailDto;
import com.pudding.base.domain.student.dto.StudentDto;
import com.pudding.base.domain.student.dto.StudentWrapperDto;
import com.pudding.base.domain.student.service.StudentDetailService;
import com.pudding.base.domain.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/student")
@Tag(name = "학생", description = "학생 정보 관련 API")
public class StudentController {

    private final StudentService studentService;
    private final StudentDetailService studentDetailService;

    @Operation(summary = "학생 등록", description = "학생 등록 후 StudentDto 객체 반환")
    @PreAuthorize("@commonService.checkCoachingRoomPermission(#accessToken)")
    @PostMapping
    public ResponseEntity<StudentWrapperDto> createStudent(@RequestHeader("Authorization") String accessToken,
                                                           @RequestBody StudentWrapperDto studentRequest) {
        StudentWrapperDto savedStudent = studentService.createStudent(accessToken, studentRequest);
        return ResponseEntity.ok(savedStudent);
    }

    @Operation(summary = "학생 수정", description = "student 테이블 수정")
    @PreAuthorize("@commonService.checkCoachingRoomPermission(#accessToken)")
    @PutMapping
    public ResponseEntity<StudentDto> updateStudent(@RequestHeader("Authorization") String accessToken,
                                                    @RequestBody StudentDto studentRequest) {
        StudentDto savedStudent = studentService.updateStudent(accessToken, studentRequest);
        return ResponseEntity.ok(savedStudent);
    }

    @Operation(summary = "학생 상세정보 수정(등록)", description = "학생 상세정보 수정 시 로그 기록을 위해 새로 저장")
    @PreAuthorize("@commonService.checkCoachingRoomPermission(#accessToken)")
    @PostMapping("/detail")
    public ResponseEntity<StudentWrapperDto> createStudentDetail(@RequestHeader("Authorization") String accessToken,
                                                                 @RequestBody StudentDetailDto studentRequest) {
        StudentWrapperDto savedStudent = studentDetailService.createStudentDetail(accessToken, studentRequest);
        return ResponseEntity.ok(savedStudent);
    }

    @Operation(summary = "학생 조회", description = "전체 학생 조회")
    @PreAuthorize("@commonService.checkCoachingRoomPermission(#accessToken)")
    @GetMapping
    public ResponseEntity<List<StudentWrapperDto>> getAllStudents(@RequestHeader("Authorization") String accessToken) {
        List<StudentWrapperDto> students = studentDetailService.findAllStudentDetails();
        return ResponseEntity.ok(students);
    }

    @Operation(summary = "학생 이름으로 조회", description = "이름을 기준으로 학생 정보 조회")
    @PreAuthorize("@commonService.checkCoachingRoomPermission(#accessToken)")
    @GetMapping("/{name}")
    public ResponseEntity<List<StudentWrapperDto>> getStudentByName(@RequestHeader("Authorization") String accessToken,
                                                                    @PathVariable String name) {
        List<StudentWrapperDto> student = studentDetailService.findStudentDetailsByStudentName(name);
        return ResponseEntity.ok(student);
    }
}
