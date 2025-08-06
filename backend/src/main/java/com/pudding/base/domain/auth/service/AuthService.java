package com.pudding.base.domain.auth.service;


import com.pudding.base.domain.auth.dto.AuthRequestDto;
import com.pudding.base.domain.auth.dto.AuthResponseDto;
import com.pudding.base.domain.auth.dto.DidLoginResponseDto;
import com.rootlab.did.ClaimInfo;

public interface AuthService {
    AuthResponseDto login(AuthRequestDto dto);
    DidLoginResponseDto didLogin(ClaimInfo dto, Integer storeId, Integer tableNumber);
    AuthResponseDto adminLogin(AuthRequestDto dto);

    String refreshToken(String refreshToken);

}