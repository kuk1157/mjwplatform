package com.pudding.base.domain.store.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StoreRequestDto {
    @NotNull(message = "점주를 선택해주세요.")
    private Integer ownerId;

    @NotNull(message = "매장 이름을 입력해주세요.")
    private String name;

    @NotNull(message = "매장 주소를 입력해주세요.")
    private String address;

    public StoreRequestDto(Integer ownerId, String name, String address){
        this.ownerId = ownerId;
        this.name = name;
        this.address = address;
    }
}
