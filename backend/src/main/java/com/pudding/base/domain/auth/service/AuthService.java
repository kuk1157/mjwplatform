package com.pudding.base.domain.auth.service;


import com.pudding.base.domain.auth.dto.AuthRequestDto;
import com.pudding.base.domain.auth.dto.AuthResponseDto;

public interface AuthService {
    AuthResponseDto login(AuthRequestDto dto);

    AuthResponseDto adminLogin(AuthRequestDto dto);
    String refreshToken(String refreshToken);

}