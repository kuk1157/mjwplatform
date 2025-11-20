package com.pudding.base.domain.loginFailLog.controller;


import com.pudding.base.domain.loginFailLog.dto.LoginFailLogDto;
import com.pudding.base.domain.loginFailLog.service.LoginFailLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "로그인 실패 로그", description = "로그인 실패 로그")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/loginFailLog")
public class LoginFailLogAdminController {
    private final LoginFailLogService loginFailLogService;

    @Operation(summary = "로그인 실패 로그 조회 API", description = "로그인 실패 로그 조회 API")
    @GetMapping
    public ResponseEntity<Page<LoginFailLogDto>> getLoginFailLogs(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                                                                  @RequestParam(value ="keyword",required = false) String keyword){
        Page<LoginFailLogDto> loginFailLogs = loginFailLogService.getLoginFailLogs(pageable, keyword);
        return ResponseEntity.ok(loginFailLogs);
    }

}
