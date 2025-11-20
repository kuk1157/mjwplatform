package com.pudding.base.domain.loginFailLog.service;

import com.pudding.base.domain.loginFailLog.dto.LoginFailLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoginFailLogService {

    // 로그인 실패 로그 등록
    LoginFailLogDto createLoginFailLog(LoginFailLogDto.Request loginFailLogDto);

    // 로그인 실패 로그 조회
    Page<LoginFailLogDto> getLoginFailLogs(Pageable pageable, String keyword);
}
