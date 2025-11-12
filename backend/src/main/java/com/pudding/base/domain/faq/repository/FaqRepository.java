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

    // FAQ 전체 조회
    @Query("SELECT f FROM Faq f " +
            "WHERE f.isActive = com.pudding.base.domain.common.enums.IsActive.y " + // 추가
            "AND (:keyword IS NULL OR :keyword = '' " +
            "   OR LOWER(f.question) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY f.createdAt DESC")
    Page<Faq> searchFaq(Pageable pageable, @Param("keyword") String keyword);

}
