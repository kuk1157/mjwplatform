package com.pudding.base.domain.notice.repository;

import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.notice.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface NoticeRepository extends JpaRepository<Notice, Integer> {

    @Query("SELECT n FROM Notice n WHERE " +
            "n.isActive = :isActive AND " +
            "(:keyword IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(n.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Notice> findByIsActiveAndLang(
                               Pageable pageable,
                               @Param("isActive") IsActive isActive,
                               @Param("keyword") String keyword
                               );
//    Page<Notice> findByIsActive(Pageable pageable, IsActive isActive);

    Optional<Notice> findByIdAndIsActive(Integer id, IsActive isActive);
    default Optional<Notice> findByIdActive(Integer id) {
        return findByIdAndIsActive(id, IsActive.y);
    }

    List<Notice> findByTitleContainingOrDescriptionContaining(String keyword, String keyword2);
    @Query(value = "SELECT * FROM notice "
            + "WHERE id = (SELECT prev_no FROM (SELECT id, LAG(id, 1, -1) OVER(ORDER BY id) AS prev_no FROM notice WHERE is_active = 'y') B "
            + "WHERE id = :id)", nativeQuery = true)
    Notice findPrevNotice(Integer id);

    @Query(value = "SELECT * FROM notice "
            + "WHERE id = (SELECT prev_no FROM (SELECT id, LEAD(id, 1, -1) OVER(ORDER BY id) AS prev_no FROM notice WHERE is_active = 'y') B "
            + "WHERE id = :id)", nativeQuery = true)
    Notice findNextNotice(Integer id);
}