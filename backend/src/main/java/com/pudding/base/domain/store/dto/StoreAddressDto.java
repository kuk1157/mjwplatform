package com.pudding.base.domain.store.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StoreAddressDto {

    private double latitude; // 위도
    private double longitude; // 경도


    public StoreAddressDto(double latitude, double longitude){
        this.latitude = latitude;
        this.longitude = longitude;
    }

}
