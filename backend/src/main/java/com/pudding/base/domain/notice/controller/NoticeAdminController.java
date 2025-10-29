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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Tag(name = "공지사항 관리자", description = "공지사항 관리자 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/notices")
public class NoticeAdminController {

    private final NoticeService noticeService;
    private final JwtUtil jwtTokenProvider;

    @Operation(summary = "공지사항 등록(에디터 다중, 썸네일첨부)", description = "공지사항 등록 후 NoticeDto 객체 반환")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @PostMapping
    public ResponseEntity<NoticeDto> createNotice(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "files", required = false) List<MultipartFile> files, // 에디터 첨부
            @RequestParam(value = "file", required = false) MultipartFile file // 썸네일 첨부
    ) {
        String uuid = UUID.randomUUID().toString();
        NoticeDto.Request noticeDto = new NoticeDto.Request(title, uuid, description);
        NoticeDto savedNotice = noticeService.createNotice(noticeDto, files, file);
        return ResponseEntity.ok(savedNotice);
    }

    @Operation(summary = "공지사항 수정", description = "공지사항 게시글 수정 후 NoticeDto 객체 반환")
    @PutMapping
    public ResponseEntity<NoticeDto> updateNotice(
            @RequestParam("id") Integer id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "file", required = false) MultipartFile file // 썸네일 첨부
    ) {
        String uuid = UUID.randomUUID().toString();
        NoticeDto.Request noticeDto = new NoticeDto.Request(title, uuid, description);
        NoticeDto noticeEdu = noticeService.updateNotice(id, noticeDto, files, file);
        return ResponseEntity.ok(noticeEdu);
    }


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


    @Operation(summary = "공지사항 삭제", description = "공지사항 게시글의 is_active를 n으로 변경")
    @DeleteMapping("/{id}")
    public ResponseEntity<NoticeDto> deleteNotice(@PathVariable Integer id) {
        NoticeDto deletedNotice = noticeService.deleteNotice(id);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}