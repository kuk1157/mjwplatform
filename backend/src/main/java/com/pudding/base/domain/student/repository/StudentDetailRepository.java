package com.pudding.base.domain.student.repository;

import com.pudding.base.domain.student.entity.StudentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface StudentDetailRepository extends JpaRepository<StudentDetail, Integer> {

    @Query("""
        SELECT sd FROM StudentDetail sd
        WHERE sd.id IN (
            SELECT MAX(subSd.id)
            FROM StudentDetail subSd
            GROUP BY subSd.student.id
        )
    """)
    List<StudentDetail> findLatestDetailsForAllStudents();
    StudentDetail findByStudentId(Integer studentId);
    @Query("""
        SELECT sd FROM StudentDetail sd
        WHERE sd.id = (
            SELECT MAX(subSd.id)
            FROM StudentDetail subSd 
            WHERE subSd.student.id = sd.student.id
        )
        AND sd.student.name LIKE %:name%
    """)
    List<StudentDetail> findByStudentNameContaining(String name);
}