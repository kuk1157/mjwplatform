package com.pudding.base.domain.faq.controller;

import com.pudding.base.domain.faq.dto.FaqDto;
import com.pudding.base.domain.faq.service.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Tag(name = "faq 관련 전체 테이블", description= "관리자 전용, faq CRUD")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/faqs")
public class FaqAdminController {
    private final FaqService faqService;

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @Operation(summary = "faq 등록", description = "관리자 전산에서 faq 등록")
    @PostMapping
    public ResponseEntity<FaqDto> createFaq(@RequestBody FaqDto.Request faqDto){
        FaqDto createFaq = faqService.createFaq(faqDto);
        return ResponseEntity.ok(createFaq);
    }


    @Operation(summary = "faq 수정", description = "관리자 전산에서 FAQ 수정")
    @PutMapping("/{id}")
    public ResponseEntity<FaqDto> updateFaq(@RequestBody FaqDto.Request faqDto, @PathVariable Integer id){
        FaqDto updateFaq = faqService.updateFaq(faqDto, id);
        return ResponseEntity.ok(updateFaq);
    }


    @Operation(summary = "faq 리스트", description = "FAQ 목록 조회")
    @GetMapping
    public ResponseEntity<Page<FaqDto>> getAllFaq(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                                                  @RequestParam(value ="keyword",required = false) String keyword){
        Page<FaqDto> getFaqs = faqService.getAllFaq(pageable, keyword);
        return ResponseEntity.ok(getFaqs);
    }

    @Operation(summary = "faq 상세보기", description = "FAQ 상세 조회")
    @GetMapping("/{id}")
    public ResponseEntity<FaqDto> getFaqById(@PathVariable Integer id){
        FaqDto Faq = faqService.getFaqById(id);
        return ResponseEntity.ok(Faq);
    }

    @Operation(summary = "faq 삭제", description = "faq 게시글의 is_active를 n으로 변경")
    @DeleteMapping("/{id}")
    public ResponseEntity<FaqDto> deleteFaq(@PathVariable Integer id) {
        FaqDto deletedFaq = faqService.deleteFaq(id);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }


}
