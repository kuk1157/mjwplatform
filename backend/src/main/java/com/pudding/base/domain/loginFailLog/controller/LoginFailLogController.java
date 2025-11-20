package com.pudding.base.domain.loginFailLog.controller;


import com.pudding.base.domain.loginFailLog.dto.LoginFailLogDto;
import com.pudding.base.domain.loginFailLog.service.LoginFailLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "로그인 실패 로그", description = "로그인 실패 로그")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/loginFailLog")
public class LoginFailLogController {

    private final LoginFailLogService loginFailLogService;

    @Operation(summary = "로그인 실패 로그 등록", description = "로그인 실패 로그 등록 API")
    @PostMapping
    public ResponseEntity<LoginFailLogDto> createLoginFailLog(@RequestBody LoginFailLogDto.Request loginFailLogDto){
        LoginFailLogDto savedLoginFailLog = loginFailLogService.createLoginFailLog(loginFailLogDto);
        return ResponseEntity.ok(savedLoginFailLog);
    }
}
