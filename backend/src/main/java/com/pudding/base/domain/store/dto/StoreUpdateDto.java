package com.pudding.base.domain.store.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StoreUpdateDto {
    @NotNull(message = "매장 이름을 입력해주세요.")
    private String name;

    @NotNull(message = "매장 주소를 입력해주세요.")
    private String address;

    public StoreUpdateDto(String name, String address){
        this.name = name;
        this.address = address;
    }
}
