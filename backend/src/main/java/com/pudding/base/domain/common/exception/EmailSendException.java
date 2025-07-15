package com.pudding.base.domain.common.exception;


public class EmailSendException extends RuntimeException {
    public EmailSendException(String message) {
        super(message);
    }
}
