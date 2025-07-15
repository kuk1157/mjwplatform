package com.pudding.base.domain.notice.service;

import com.pudding.base.domain.notice.dto.NoticeDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface NoticeService {

    // 공지사항 등록 - 에디터 다중첨부, 아래 썸네일 첨부 추가
    NoticeDto createNotice(NoticeDto.Request noticeDto, List<MultipartFile> files, MultipartFile file);

    // 공지사항 수정 - 에디터 다중첨부, 아래 썸네일 첨부 추가
    NoticeDto updateNotice(Integer id, NoticeDto.Request noticeEdu, List<MultipartFile> files, MultipartFile file);

    NoticeDto findNoticeById(Integer id);
    Page<NoticeDto> findAllNotices(Pageable pageable, String keyword);
    NoticeDto NoticeViewCount(Integer id);
//    NoticeDto updateNotice(Integer id, NoticeDto noticeDto);
    NoticeDto deleteNotice(Integer id);


}