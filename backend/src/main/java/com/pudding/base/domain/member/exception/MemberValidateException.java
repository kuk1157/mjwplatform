package com.pudding.base.domain.member.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MemberValidateException extends RuntimeException {
    public MemberValidateException(String message) {
        super(message);
    }
}