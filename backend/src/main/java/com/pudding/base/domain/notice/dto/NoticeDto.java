package com.pudding.base.domain.notice.dto;

import com.pudding.base.domain.notice.entity.Notice;
import com.pudding.base.file.FileInfo;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NoticeDto {

    private Integer id;
    private String uuid;
    private String title;
    private String description;
    private String author;
    private Integer view;
    private LocalDateTime createdAt;
    private List<FileInfo> filePaths;
    private PrevNextNoticeDto prevNotice; // 이전 공지사항
    private PrevNextNoticeDto nextNotice; // 다음 공지사항


    private String thumbnail; // 파일업로드 1개용 썸네일
    private String extension; // 파일업로드 1개용 확장자

    @Builder
    public NoticeDto(Integer id, String uuid, String title, String description, String author, Integer view, LocalDateTime createdAt , PrevNextNoticeDto prevNotice, PrevNextNoticeDto nextNotice, List<FileInfo> filePaths, String thumbnail, String extension) {
        this.id = id;
        this.uuid = uuid;
        this.title = title;
        this.description = description;
        this.author = author;
        this.view = view;
        this.createdAt = createdAt;
        this.prevNotice = prevNotice;
        this.nextNotice = nextNotice;
        this.filePaths = filePaths;
        this.thumbnail = thumbnail; // 파일업로드 1개용 썸네일
        this.extension = extension; // 파일업로드 1개용 확장자
    }

    public static NoticeDto fromEntity(Notice notice) {
        return NoticeDto.builder()
                .id(notice.getId())
                .uuid(notice.getUuid())
                .title(notice.getTitle())
                .description(notice.getDescription())
                .author(notice.getAuthor())
                .view(notice.getView())
                .createdAt(notice.getCreatedAt())
                .filePaths(notice.getFilePaths())
                .thumbnail(notice.getThumbnail())
                .extension(notice.getExtension())
                .build();
    }
    public static NoticeDto fromEntityWithPrevNext(Notice notice) {
        NoticeDto dto = fromEntity(notice);

        if (notice.getPrevNotice() != null) {
            dto.prevNotice = PrevNextNoticeDto.builder()
                    .id(notice.getPrevNotice().getId())
                    .title(notice.getPrevNotice().getTitle())
                    .build();
        }
        if (notice.getNextNotice() != null) {
            dto.nextNotice = PrevNextNoticeDto.builder()
                    .id(notice.getNextNotice().getId())
                    .title(notice.getNextNotice().getTitle())
                    .build();
        }

        return dto;
    }
    public Notice toEntity() {
        return Notice.builder()
                .title(this.title)
                .uuid(this.uuid)
                .description(this.description)
                .view(this.view)
                .build();
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Request {
        @NotBlank(message = "제목을 입력해 주세요.")
        private String title;

        private String uuid;

        @NotBlank(message = "내용을 입력해 주세요.")
        private String description;

        @Builder
        public Request(String title, String uuid, String description) {
            this.title = title;
            this.uuid = uuid;
            this.description = description;
        }

        public Notice toEntity() {
            return Notice.builder()
                    .title(this.title)
                    .uuid(this.uuid)
                    .description(this.description)
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class PrevNextNoticeDto {
        private Integer id;
        private String title;

        @Builder
        public PrevNextNoticeDto(Integer id, String title) {
            this.id = id;
            this.title = title;
        }
    }

}
