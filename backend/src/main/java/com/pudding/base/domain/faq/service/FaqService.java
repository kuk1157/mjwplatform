package com.pudding.base.domain.faq.service;

import com.pudding.base.domain.faq.dto.FaqDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FaqService {

    // FAQ 등록
    FaqDto createFaq(FaqDto.Request faqDto);

    // FAQ 수정
    FaqDto updateFaq(FaqDto.Request faqDto, Integer id);

    // FAQ 전체 조회
    Page<FaqDto> getAllFaq(Pageable pageable, String keyword);

    // FAQ 상세 보기
    FaqDto getFaqById(Integer id);

    // FAQ 삭제
    FaqDto deleteFaq(Integer id);
}
