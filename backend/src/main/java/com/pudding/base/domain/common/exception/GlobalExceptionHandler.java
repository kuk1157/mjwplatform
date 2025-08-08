package com.pudding.base.domain.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<Map<String, String>> handCustomException(CustomException exception){
        Map<String, String> error = new HashMap<>();
        error.put("message", exception.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}
