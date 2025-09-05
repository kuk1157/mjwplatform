package com.pudding.base.crypto.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * enc 메타/복호화 관련 공통 예외
 */
@Getter
public class EncMetaException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    /**
     * 에러코드 & HTTP 상태 매핑
     */
    public enum Code {
        ENC_META_NOT_FOUND(HttpStatus.NOT_FOUND),
        CIPHER_HASH_MISMATCH(HttpStatus.BAD_REQUEST),
        AAD_MISMATCH(HttpStatus.FORBIDDEN),
        KMS_ERROR(HttpStatus.BAD_GATEWAY),
        VALIDATION_ERROR(HttpStatus.BAD_REQUEST),
        INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR);

        private final HttpStatus status;

        Code(HttpStatus status) {
            this.status = status;
        }

        public HttpStatus status() {
            return status;
        }
    }

    /**
     * 문자열 코드(하위호환용)
     */
    private final String errorCode;
    /**
     * 타입 세이프 코드
     */
    private final Code code;

    public EncMetaException(String message, Code code) {
        super(message);
        this.code = code;
        this.errorCode = code.name();
    }

    public EncMetaException(String message, Code code, Throwable cause) {
        super(message, cause);
        this.code = code;
        this.errorCode = code.name();
    }

    public HttpStatus status() {
        return code.status();
    }

    // ---- 정적 팩토리 ----
    public static EncMetaException notFound(int id) {
        return new EncMetaException("enc meta not found: id=" + id, Code.ENC_META_NOT_FOUND);
    }

    public static EncMetaException cipherMismatch() {
        return new EncMetaException("cipher hash mismatch", Code.CIPHER_HASH_MISMATCH);
    }

    public static EncMetaException aadMismatch() {
        return new EncMetaException("AAD mismatch", Code.AAD_MISMATCH);
    }

    public static EncMetaException kms(String msg) {
        return new EncMetaException("KMS error: " + msg, Code.KMS_ERROR);
    }

    public static EncMetaException kms(String msg, Throwable cause) {
        return new EncMetaException("KMS error: " + msg, Code.KMS_ERROR, cause);
    }

    public static EncMetaException validation(String msg) {
        return new EncMetaException(msg, Code.VALIDATION_ERROR);
    }

    public static EncMetaException internal(String msg) {
        return new EncMetaException(msg, Code.INTERNAL_ERROR);
    }

    public static EncMetaException internal(String msg, Throwable cause) {
        return new EncMetaException(msg, Code.INTERNAL_ERROR, cause);
    }
}
