package com.pudding.base.domain.loginFailLog.service;

import com.pudding.base.domain.loginFailLog.dto.LoginFailLogDto;
import com.pudding.base.domain.loginFailLog.entity.LoginFailLog;
import com.pudding.base.domain.loginFailLog.repository.LoginFailLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LoginFailLogServiceImpl implements LoginFailLogService{
    private final LoginFailLogRepository loginFailLogRepository;

    @Transactional
    @Override
    public LoginFailLogDto createLoginFailLog(LoginFailLogDto.Request loginFailLogDto){
        LoginFailLog loginFailLog = LoginFailLog.builder()
                .failType(loginFailLogDto.getFailType())
                .message(loginFailLogDto.getMessage())
                .build();
        LoginFailLog savedLoginFailLog = loginFailLogRepository.save(loginFailLog);
        return LoginFailLogDto.fromEntity(savedLoginFailLog);

    }

    @Override
    public Page<LoginFailLogDto> getLoginFailLogs(Pageable pageable, String keyword) {
        Page<LoginFailLog> logs;
        if (keyword == null || keyword.trim().isEmpty()) {
            logs = loginFailLogRepository.findAll(pageable);
        } else {
            logs = loginFailLogRepository.findByKeyword(keyword, pageable);
        }
        return logs.map(LoginFailLogDto::fromEntity);
    }
}
