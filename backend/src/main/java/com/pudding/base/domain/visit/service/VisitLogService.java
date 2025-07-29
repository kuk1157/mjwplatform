package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.visit.dto.VisitLogDto;

public interface VisitLogService {

    VisitLogDto createQrVisitLog(VisitLogDto.Request visitLogDto, Integer storeNum, Integer tableNumber);
}
