package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.common.enums.IsPaymentStatus;
import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.visit.dto.VisitLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VisitLogService {

    VisitLogDto createVisitLog(String did, Integer storeNum, Integer tableNumber);



    // 점주 기준 방문 전체 조회
    Page<VisitLogDto> getAllVisitLog(Integer storeNum, Pageable pageable);

    // 고객 NFT 전체 조회
    List<VisitLogDto> getAllVisitLogSorted(Integer customerId, String sort);

    // 고객 NFT 최근 2개 조회
    List<VisitLogDto> getLimitedVisitLogSorted(Integer customerId, String sort, Integer limit);

    List<VisitLogDto> getNewVisitLog(Integer storeNum);
}
