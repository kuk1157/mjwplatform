package com.pudding.base.domain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DidLoginResponseDto {
    private AuthResponseDto auth;
    private Integer customerId;
}
