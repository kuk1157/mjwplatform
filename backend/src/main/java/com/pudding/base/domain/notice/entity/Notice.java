package com.pudding.base.domain.notice.entity;

import com.pudding.base.domain.common.entity.TimeAndStatusEntity;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.file.FileInfo;
import com.pudding.base.file.FileInfoListConverter;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "notice")
public class Notice extends TimeAndStatusEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "uuid")
    private String uuid;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "author")
    private String author;

    @Column(name = "view")
    private Integer view;

    // 다중 파일 업로드용
    @Lob
    @Convert(converter = FileInfoListConverter.class)
    private List<FileInfo> filePaths;

    // 파일업로드 1개용 썸네일 컬럼
    @Column(name = "thumbnail")
    private String thumbnail;

    // 파일업로드 1개용 확장자 컬럼
    @Column(name = "extension")
    private String extension;


    @Transient
    private Notice prevNotice;

    @Transient
    private Notice nextNotice;

    @PrePersist
    public void prePersist() {
        super.prePersist();
        super.updateIsActive(IsActive.y);
        this.author = "관리자";
        this.view = 0;
    }
    @Builder(toBuilder = true)
    public Notice(String title, String description, String author, Integer view, String uuid, List<FileInfo> filePaths) {
        this.uuid = uuid;
        this.title = title;
        this.description = description;
        this.author = author;
        this.view = view;
        this.filePaths = filePaths;
    }
    public void updateTitle(String title) {
        this.title = title;
    }
    public void updateDescription(String description) {
        this.description = description;
    }

    public void updatePrevNotice(Notice prevNotice) {
        this.prevNotice = prevNotice;
    }

    public void updateNextNotice(Notice nextNotice) {
        this.nextNotice = nextNotice;
    }

    public void updateViewCount(Integer view) {
        this.view = view;
    }

    public void updateFilePaths(List<FileInfo> filePaths) {
        this.filePaths = filePaths;
    }


    // 파일업로드 1개용 썸네일 컬럼
    public void updateThumbnail(String thumbnail){
        this.thumbnail = thumbnail;
    }

    // 파일업로드 1개용 확장자 컬럼
    public void updateExtension(String extension){
        this.extension = extension;
    }
}