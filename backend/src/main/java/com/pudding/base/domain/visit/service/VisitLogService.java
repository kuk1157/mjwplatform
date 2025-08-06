package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.visit.dto.VisitLogDto;

import java.util.List;

public interface VisitLogService {

    VisitLogDto createVisitLog(String did, Integer storeNum, Integer tableNumber);

    List<VisitLogDto> getAllVisitLog(Integer storeNum);

    List<VisitLogDto> getStoreByAndVisitStatusByVisitLog(Integer storeNum, IsVisitStatus visitStatus);
}
