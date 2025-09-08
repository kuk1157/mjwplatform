package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.common.enums.IsPaymentStatus;
import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.visit.dto.VisitLogDto;

import java.util.List;

public interface VisitLogService {

    VisitLogDto createVisitLog(String did, Integer storeNum, Integer tableNumber);

    List<VisitLogDto> getAllVisitLog(Integer storeNum);

    // 고객 NFT 전체 조회
    List<VisitLogDto> getAllVisitLogSorted(Integer customerId, String sort);

    // 고객 NFT 최근 2개 조회
    List<VisitLogDto> getLimitedVisitLogSorted(Integer customerId, String sort, Integer limit);

    List<VisitLogDto> getNewVisitLog(Integer storeNum);
}
