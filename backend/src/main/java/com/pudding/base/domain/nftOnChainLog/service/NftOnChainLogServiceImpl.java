package com.pudding.base.domain.nftOnChainLog.service;


import com.pudding.base.domain.nftOnChainLog.dto.NftOnChainLogDto;
import com.pudding.base.domain.nftOnChainLog.entity.NftOnChainLog;
import com.pudding.base.domain.nftOnChainLog.repository.NftOnChainLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NftOnChainLogServiceImpl implements NftOnChainLogService {
    private final NftOnChainLogRepository nftOnChainLogRepository;

    @Override
    public Page<NftOnChainLogDto> getNftOnChainLogs(Pageable pageable, String keyword) {
        Page<NftOnChainLog> logs;
        if (keyword == null || keyword.trim().isEmpty()) {
            logs = nftOnChainLogRepository.findAll(pageable);
        } else {
            logs = nftOnChainLogRepository.findByKeyword(keyword, pageable);
        }
        return logs.map(NftOnChainLogDto::fromEntity);
    }
}
