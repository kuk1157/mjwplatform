package com.pudding.base.domain.faq.repository;

import com.pudding.base.domain.faq.dto.FaqDto;
import com.pudding.base.domain.faq.entity.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Integer> {

    // 질문과 답변 모두 keyword 검색
    @Query("SELECT f FROM Faq f " +
            "WHERE LOWER(f.question) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Faq> findAll(Pageable pageable, @Param("keyword") String keyword);

}
