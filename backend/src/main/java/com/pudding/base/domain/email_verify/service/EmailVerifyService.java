package com.pudding.base.domain.email_verify.service;

import com.pudding.base.domain.email_verify.dto.EmailVerifyDto;
import org.springframework.http.ResponseEntity;

public interface EmailVerifyService {
    void sendEmail(EmailVerifyDto.Request emailVerifyDto);

    ResponseEntity<?> verifyEmail(EmailVerifyDto.Request emailVerifyDto);
}
