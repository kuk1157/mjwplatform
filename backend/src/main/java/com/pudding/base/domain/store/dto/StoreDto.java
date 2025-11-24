package com.pudding.base.domain.store.dto;

import com.pudding.base.domain.store.entity.Store;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StoreDto {
    private Integer id;
    private Integer ownerId;
    private String name;
    private String address;
    private Double latitude; // 위도
    private Double longitude; // 경도
    private Integer grade; // 등급코드
    private String thumbnail; // 파일업로드 1개용 썸네일
    private String extension; // 파일업로드 1개용 확장자
    private String ownerName;
    private LocalDateTime createdAt;

    @Builder
    public StoreDto(Integer id,Integer ownerId,String name, String address, Double latitude, Double longitude, Integer grade, String thumbnail, String extension, String ownerName, LocalDateTime createdAt){
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.grade = grade;
        this.thumbnail = thumbnail;
        this.extension = extension;
        this.ownerName = ownerName;
        this.createdAt = createdAt;
    }

    public static StoreDto fromEntity(Store store) {
        return StoreDto.builder()
                .id(store.getId())
                .ownerId(store.getOwnerId())
                .name(store.getName())
                .address(store.getAddress())
                .latitude(store.getLatitude())
                .longitude(store.getLongitude())
                .grade(store.getGrade())
                .thumbnail(store.getThumbnail())
                .extension(store.getExtension())
                .createdAt(store.getCreatedAt())
                .build();
    }

}
