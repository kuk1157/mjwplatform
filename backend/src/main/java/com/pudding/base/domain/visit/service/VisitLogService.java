package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.visit.dto.VisitLogDto;

import java.util.List;

public interface VisitLogService {

    VisitLogDto createVisitLog(VisitLogDto.Request visitLogDto, Integer storeNum, Integer tableNumber);

    List<VisitLogDto> getAllVisitLog(Integer storeNum);
}
