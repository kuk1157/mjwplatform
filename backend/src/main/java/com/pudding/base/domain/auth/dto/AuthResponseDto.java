package com.pudding.base.domain.auth.dto;

import com.pudding.base.domain.auth.entity.Auth;
import com.pudding.base.domain.member.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
    private String tokenType;
    private String accessToken;
    private String refreshToken;
    private Role role;

    @Builder
    public AuthResponseDto(Auth entity) {
        this.tokenType = entity.getTokenType();
        this.accessToken = entity.getAccessToken();
        this.refreshToken = entity.getRefreshToken();
        this.role = entity.getMember().getRole();
    }
}