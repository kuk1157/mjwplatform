package com.pudding.base.domain.faq.controller;
import com.pudding.base.domain.faq.dto.FaqDto;
import com.pudding.base.domain.faq.service.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "faq 관련 전체 테이블", description= "관리자 이외 전용")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/faqs")
public class FaqController {
    private final FaqService faqService;
    @Operation(summary = "faq 리스트", description = "FAQ 목록 조회")
    @GetMapping
    public ResponseEntity<Page<FaqDto>> getAllFaq(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                                                  @RequestParam(value ="keyword",required = false) String keyword){
        Page<FaqDto> getFaqs = faqService.getAllFaq(pageable, keyword);
        return ResponseEntity.ok(getFaqs);
    }
}
