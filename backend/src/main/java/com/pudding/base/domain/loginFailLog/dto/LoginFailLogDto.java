package com.pudding.base.domain.loginFailLog.dto;

import com.pudding.base.domain.loginFailLog.entity.LoginFailLog;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class LoginFailLogDto {
    private Integer id;
    private String errorCode;
    private String failType;
    private String message;
    private LocalDateTime createdAt;

    @Builder
    public LoginFailLogDto(Integer id, String errorCode, String failType, String message, LocalDateTime createdAt){
        this.id = id;
        this.errorCode = errorCode;
        this.failType = failType;
        this.message = message;
        this.createdAt = createdAt;
    }

    public static LoginFailLogDto fromEntity(LoginFailLog loginFailLog) {
        return LoginFailLogDto.builder()
                .id(loginFailLog.getId())
                .errorCode(loginFailLog.getErrorCode())
                .failType(loginFailLog.getFailType())
                .message(loginFailLog.getMessage())
                .createdAt(loginFailLog.getCreatedAt())
                .build();
    }

    @Getter
    @NoArgsConstructor
    public static class Request{
        private String failType;
        private String message;

        public Request(String failType, String message){
            this.failType = failType;
            this.message = message;
        }
    }
}
