package com.pudding.base.domain.notice.service;

import com.pudding.base.domain.auth.repository.AuthRepository;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.notice.dto.NoticeDto;
import com.pudding.base.domain.notice.entity.Notice;
import com.pudding.base.domain.notice.exception.NoticeNotFoundException;
import com.pudding.base.domain.notice.repository.NoticeRepository;
import com.pudding.base.file.FileInfo;
import com.pudding.base.file.s3.S3Service;
import com.pudding.base.util.FileUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final AuthRepository authRepository;
    private final S3Service s3Service;

    String folderName = "base/notice";


    // 공지사항 등록
    @Transactional
    @Override
    public NoticeDto createNotice(NoticeDto.Request noticeDto, List<MultipartFile> files, MultipartFile file) {
        Notice notice = Notice.builder()
                .title(noticeDto.getTitle())
                .uuid(noticeDto.getUuid())
                .description(noticeDto.getDescription())
                .filePaths(new ArrayList<>())
                .build();

        List<FileInfo> fileInfos = new ArrayList<>();
        String description = noticeDto.getDescription();

        // 2가지 파일첨부 최종 성공 체크를 위한 배열
        List<String> uploadedS3Paths = new ArrayList<>();

    try {
        // 아래 썸네일 첨부 따로 만들기.(배열로 넣지않고 각 컬럼에 저장하기)
        if (file != null && !file.isEmpty()) {
                String fileUuid = UUID.randomUUID().toString();
                String extension = FileUtils.getFileExtension(file.getOriginalFilename());
               // DB에 썸네일, 확장자 저장
               notice.updateThumbnail(fileUuid);
               notice.updateExtension("."+extension);

               String objectName = folderName + "/" + notice.getUuid() + "/" + fileUuid + "." + extension;
                // 업로드
                s3Service.uploadFile(objectName, file);

                // 썸네일 정보 담기(최종성공체크)
                uploadedS3Paths.add(objectName);
        }

        if (files != null && !files.isEmpty()) {
            // 파일이나 동영상
            for (MultipartFile editorFile : files) {
                String fileType = FileUtils.determineFileType(editorFile.getContentType());
                String uuid = UUID.randomUUID().toString();
                String objectName = folderName+"/"+ notice.getUuid() + "/" + uuid+"." + FileUtils.getFileExtension(editorFile.getOriginalFilename());

                Integer width = null;
                Pattern pattern = Pattern.compile("media-width_(\\d+)");
                Matcher matcher = pattern.matcher(editorFile.getOriginalFilename());
                if (matcher.find()) {
                    width = Integer.parseInt(matcher.group(1));
                }

                s3Service.multipartUpload(objectName, editorFile);
                // 에디터 정보 담기(최종성공체크)
                uploadedS3Paths.add(objectName);

                // 보안 이미지 경로 생성 10분만 유효하도록 설정(아래 배열에 추가)
                String presignedUrl = s3Service.generatePresignedUrl(objectName, 600);
                // 이미지 유효시간 10분(아래 배열에 추가)
                Long expirationTime = System.currentTimeMillis() + 600 * 1000;

                fileInfos.add(new FileInfo(uuid, fileType, objectName, width, "추후 활용", expirationTime));
            }

            // uuid 넣기
            int uuidIndex = 0;
            while (description.contains("{{uuid}}") && uuidIndex < fileInfos.size()) {
                String placeholder = Pattern.quote("{{uuid}}");
                String updatedPlaceholder = "{{" + fileInfos.get(uuidIndex).getUuid() + "}}";  // 각 파일에 대한 UUID 사용

                description = description.replaceFirst(placeholder, updatedPlaceholder);
                uuidIndex++;
            }
        }


    }catch (Exception e) {
        // 실패한 경우 업로드된 파일 롤백
        for (String path : uploadedS3Paths) {
            try {
                s3Service.deleteFile(path); // 삭제 메서드 활용
            } catch (Exception ex) {
                System.out.println("파일 롤백 실패: " + path);
            }
        }
        throw new RuntimeException("파일 업로드 실패", e);
    }
        notice.updateDescription(description);
        notice.updateFilePaths(fileInfos);

        Notice savedNotice = noticeRepository.save(notice);

        return NoticeDto.fromEntity(savedNotice);
    }

    // 공지사항 수정
    @Transactional
    @Override
    public NoticeDto updateNotice(Integer id, NoticeDto.Request noticeDto, List<MultipartFile> files, MultipartFile file) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException("공지사항이 존재하지 않습니다."));

        List<FileInfo> fileInfos = new ArrayList<>();
        String description = noticeDto.getDescription();

        // 2가지 파일첨부 최종 성공 체크를 위한 배열
        List<String> uploadedS3Paths = new ArrayList<>();

        try {
            // 아래 썸네일 첨부 따로 만들기.(배열로 넣지않고 각 컬럼에 저장하기)
            if (file != null && !file.isEmpty()) {
                String fileUuid = UUID.randomUUID().toString();
                String extension = FileUtils.getFileExtension(file.getOriginalFilename());
                // DB에 썸네일, 확장자 저장
                notice.updateThumbnail(fileUuid);
                notice.updateExtension("."+extension);

                String objectName = folderName + "/" + notice.getUuid() + "/" + fileUuid + "." + extension;
                // 업로드
                s3Service.uploadFile(objectName, file);
                // 썸네일 정보 담기(최종성공체크)
                uploadedS3Paths.add(objectName);
            }

            if (files != null && !files.isEmpty()) {
                // 파일이나 동영상
                for (MultipartFile editorFile : files) {
                    String fileType = FileUtils.determineFileType(editorFile.getContentType());
                    String uuid = UUID.randomUUID().toString();
                    String objectName = folderName+"/"+ notice.getUuid() + "/" + uuid+"." + FileUtils.getFileExtension(editorFile.getOriginalFilename());

                    Integer width = null;
                    Pattern pattern = Pattern.compile("media-width_(\\d+)");
                    Matcher matcher = pattern.matcher(editorFile.getOriginalFilename());
                    if (matcher.find()) {
                        width = Integer.parseInt(matcher.group(1));
                    }

                    s3Service.multipartUpload(objectName, editorFile);
                    // 에디터 정보 담기(최종성공체크)
                    uploadedS3Paths.add(objectName);

                    // 보안 이미지 경로 생성 10분만 유효하도록 설정(아래 배열에 추가)
                    String presignedUrl = s3Service.generatePresignedUrl(objectName, 600);
                    // 이미지 유효시간 10분(아래 배열에 추가)
                    Long expirationTime = System.currentTimeMillis() + 600 * 1000;

                    fileInfos.add(new FileInfo(uuid, fileType, objectName, width, presignedUrl, expirationTime));
                }

                // uuid 넣기
                int uuidIndex = 0;
                while (description.contains("{{uuid}}") && uuidIndex < fileInfos.size()) {

                    String placeholder = Pattern.quote("{{uuid}}");
                    String updatedPlaceholder = "{{" + fileInfos.get(uuidIndex).getUuid() + "}}";  // 각 파일에 대한 UUID 사용

                    description = description.replaceFirst(placeholder, updatedPlaceholder);

                    uuidIndex++;
                }
            }
        } catch (Exception e) {
            // 실패한 경우 업로드된 파일 롤백
            for (String path : uploadedS3Paths) {
                try {
                    s3Service.deleteFile(path); // 삭제 메서드 활용
                } catch (Exception ex) {
                    System.out.println("파일 롤백 실패: " + path);
                }
            }
            throw new RuntimeException("파일 업로드 실패", e);
        }

        List<FileInfo> updatedFileInfos = new ArrayList<>(notice.getFilePaths() != null ? notice.getFilePaths() : new ArrayList<>());
        Set<String> usedUuids = new HashSet<>();
        Matcher matcher = Pattern.compile("\\{\\{([\\w-]+)(?:&width_(\\d+))?}}").matcher(description);

        Map<String, String> uuidToWidthMap = new HashMap<>();
        while (matcher.find()) {
            String uuid = matcher.group(1);
            String width = matcher.group(2);
            usedUuids.add(uuid);

            if (width != null) {
                uuidToWidthMap.put(uuid, width);
            }
        }

        // filePaths에 width 추가
        for (FileInfo fileInfo : updatedFileInfos) {
            String uuid = fileInfo.getUuid();
            String width = uuidToWidthMap.get(uuid);

            if (width != null) {
                fileInfo.setWidth(Integer.valueOf(width));
            }
        }

        // width 제거
        for (Map.Entry<String, String> entry : uuidToWidthMap.entrySet()) {
            String uuid = entry.getKey();
            description = description.replace("{{" + uuid + "&width_" + entry.getValue() + "}}", "{{" + uuid + "}}");
        }


        fileInfos.stream()
                .filter(fileInfo -> usedUuids.contains(fileInfo.getUuid()) &&
                        updatedFileInfos.stream().noneMatch(existing -> existing.getUuid().equals(fileInfo.getUuid())))
                .forEach(updatedFileInfos::add);

        updatedFileInfos.removeIf(fileInfo -> !usedUuids.contains(fileInfo.getUuid()));

        notice.updateDescription(description);
        notice.updateFilePaths(updatedFileInfos);
        notice.updateTitle(noticeDto.getTitle());

//        Notice updatedNotice = notice.toBuilder()
//                .title(noticeDto.getTitle())
//                .description(noticeDto.getDescription())
//                .build();

        noticeRepository.save(notice);




        return NoticeDto.fromEntity(notice);
    }

    @Transactional
    @Override
    public NoticeDto deleteNotice(Integer id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException("게시글이 존재하지 않습니다."));

        notice.updateIsActive(IsActive.n);
        noticeRepository.save(notice);

        return NoticeDto.fromEntity(notice);
    }

// 공지사항 상세정보
    @Transactional(readOnly = true)
    @Override
    public NoticeDto findNoticeById(Integer id) {
        Notice notice = noticeRepository.findByIdActive(id)
                .orElseThrow(() -> new NoticeNotFoundException("공지사항이 존재하지 않습니다."));
        Notice prevNotice = noticeRepository.findPrevNotice(id);
        Notice nextNotice = noticeRepository.findNextNotice(id);
        notice.updatePrevNotice(prevNotice);
        notice.updateNextNotice(nextNotice);
        // 조회된 엔티티를 DTO로 변환해서 반환
        return NoticeDto.fromEntityWithPrevNext(notice);
    }
//
    // 전체 공지 조회
    @Transactional(readOnly = true)
    @Override
    public Page<NoticeDto> findAllNotices(Pageable pageable, String keyword) {
        Page<Notice> notices = noticeRepository.findByIsActiveAndLang(pageable, IsActive.y, keyword);
        // 모든 회원 조회 후 엔티티 리스트를 DTO 리스트로 변환
        return notices.map(NoticeDto::fromEntity); // 엔티티를 DTO로 변환
    }
    // 공지사항 조회수 카운트 올리기
    @Transactional
    @Override
    public NoticeDto NoticeViewCount(Integer id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException("공지사항이 존재하지 않습니다."));

        notice.updateViewCount(notice.getView() + 1);

        noticeRepository.save(notice);
        return NoticeDto.fromEntity(notice);
    }
}