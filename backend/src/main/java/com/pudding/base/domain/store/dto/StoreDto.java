package com.pudding.base.domain.store.dto;

import com.pudding.base.domain.store.entity.Store;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StoreDto {
    Integer id;
    Integer ownerId;
    String name;
    String address;
    String ownerName;
    LocalDateTime createdAt;

    @Builder
    public StoreDto(Integer id,Integer ownerId,String name,String address, String ownerName, LocalDateTime createdAt){
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.address = address;
        this.ownerName = ownerName;
        this.createdAt = createdAt;
    }

    public static StoreDto fromEntity(Store store) {
        return StoreDto.builder()
                .id(store.getId())
                .ownerId(store.getOwnerId())
                .name(store.getName())
                .address(store.getAddress())
                .createdAt(store.getCreatedAt())
                .build();
    }


    @Getter
    @NoArgsConstructor
    public static class Request {
        @NotNull(message = "점주를 선택해주세요.")
        private Integer ownerId;

        @NotNull(message = "매장 이름을 입력해주세요.")
        private String name;

        @NotNull(message = "매장 주소를 입력해주세요.")
        private String address;

        public Request(Integer ownerId, String name, String address){
            this.ownerId = ownerId;
            this.name = name;
            this.address = address;
        }
    }

}
