package com.pudding.base.file;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileInfo {
    private String uuid;
    private String type;
    private String path;
    private Integer width;
    private String preSignedUrl; // 이미지 경로 보안처리(presigned URL)
    private Long expirationTime; // 이미지 유효 시간

    // 기본 생성자
    public FileInfo() {}

    // 생성자
    public FileInfo(String uuid, String type, String path, Integer width, String preSignedUrl, Long expirationTime) {
        this.uuid = uuid;
        this.type = type;
        this.path = path;
        this.width = width;
        this.preSignedUrl = preSignedUrl; // 이미지 경로 보안처리(presigned URL)
        this.expirationTime = expirationTime; // 이미지 유효 시간
    }

}