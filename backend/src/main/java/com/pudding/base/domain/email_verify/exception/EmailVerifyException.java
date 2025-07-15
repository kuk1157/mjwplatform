package com.pudding.base.domain.email_verify.exception;


import lombok.Getter;

@Getter
public class EmailVerifyException extends RuntimeException {
    private final String errorCode;

    public EmailVerifyException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

}
