package com.pudding.base.domain.email_verify.dto;

import com.pudding.base.domain.email_verify.entity.EmailVerify;
import com.pudding.base.domain.email_verify.enums.IsVerify;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmailVerifyDto {
    private Integer id;
    private String email;
    private String number;
    private IsVerify isVerify;

    @Builder
    public EmailVerifyDto(Integer id, String email, String number, IsVerify isVerify) {
        this.id = id;
        this.email = email;
        this.number = number;
        this.isVerify = isVerify;
    }

    public static EmailVerifyDto fromEntity(EmailVerify emailVerify) {
        return EmailVerifyDto.builder()
                .id(emailVerify.getId())
                .email(emailVerify.getEmail())
                .number(emailVerify.getNumber())
                .isVerify(emailVerify.getIsVerify())
                .build();
    }

    // DTO에서 엔티티로 변환하는 메서드
    public EmailVerify toEntity() {
        return EmailVerify.builder()
                .email(this.email)
                .number(this.number)
                .build();
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Request {
        private String email;
        private String number;

        @Builder
        public Request(String email, String number) {
            this.email = email;
            this.number = number;
        }

        public EmailVerify toEntity() {
            return EmailVerify.builder()
                    .email(this.email)
                    .number(this.number)
                    .build();
        }
    }
}
