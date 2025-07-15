package com.pudding.base.domain.member.exception;

public class MemberInvalidPasswordException extends RuntimeException {
    public MemberInvalidPasswordException(String message) {
        super(message);
    }
}