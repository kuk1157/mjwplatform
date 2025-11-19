package com.pudding.base.domain.nftFailLog.service;


import com.pudding.base.domain.nftFailLog.dto.NftFailLogDto;
import com.pudding.base.domain.nftFailLog.entity.NftFailLog;
import com.pudding.base.domain.nftFailLog.repository.NftFailLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NftFailLogServiceImpl implements NftFailLogService {
    private final NftFailLogRepository nftFailLogRepository;

    @Override
    public Page<NftFailLogDto> getNftFailLogs(Pageable pageable, String keyword) {
        Page<NftFailLog> logs;
        if (keyword == null || keyword.trim().isEmpty()) {
            logs = nftFailLogRepository.findAll(pageable);
        } else {
            logs = nftFailLogRepository.findByKeyword(keyword, pageable);
        }
        return logs.map(NftFailLogDto::fromEntity);
    }
}
