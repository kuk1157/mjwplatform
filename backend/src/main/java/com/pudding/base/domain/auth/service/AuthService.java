package com.pudding.base.domain.auth.service;


import com.pudding.base.domain.auth.dto.AuthRequestDto;
import com.pudding.base.domain.auth.dto.AuthResponseDto;
import com.rootlab.did.ClaimInfo;

public interface AuthService {
    AuthResponseDto login(AuthRequestDto dto);
    AuthResponseDto didLogin(ClaimInfo dto);
    AuthResponseDto adminLogin(AuthRequestDto dto);

    String refreshToken(String refreshToken);

}