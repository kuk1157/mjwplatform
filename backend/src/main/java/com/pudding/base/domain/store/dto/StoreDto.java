package com.pudding.base.domain.store.dto;

import com.pudding.base.domain.store.entity.Store;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
}
