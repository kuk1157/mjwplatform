package com.pudding.base.domain.notice.controller;

import com.pudding.base.domain.notice.dto.NoticeDto;
import com.pudding.base.domain.notice.service.NoticeService;
import com.pudding.base.security.JwtUtil;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "공지사항", description = "공지사항 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notice")
public class NoticeController {

    private final NoticeService noticeService;
    private final JwtUtil jwtTokenProvider;

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })

    @Operation(summary = "공지사항 조회", description = "전체 공지사항 조회")
    @GetMapping
    public ResponseEntity<Page<NoticeDto>> getAllNotices(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                                                         @RequestParam(value ="keyword",required = false) String keyword) {
        Page<NoticeDto> notices = noticeService.findAllNotices(pageable, keyword);
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeDto> getNoticeById(

        @PathVariable
        @Schema(description = "조회 할 공지사항 id값", example = "1")
        Integer id
    ) {
        NoticeDto notice = noticeService.findNoticeById(id);
        return ResponseEntity.ok(notice);
    }

    @Operation(summary = "공지사항 조회 수", description = "공지사항 조회수 api")
    @PutMapping("/view/{id}")
    public ResponseEntity<NoticeDto> NoticeViewCount(@PathVariable Integer id) {
        NoticeDto updatedNotice = noticeService.NoticeViewCount(id);
        return ResponseEntity.ok(updatedNotice);
    }
}