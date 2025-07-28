package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.visit.dto.QrVisitLogDto;

public interface QrVisitLogService {

    QrVisitLogDto createQrVisitLog(QrVisitLogDto.Request qrVisitLogDto, Integer storeNum, Integer tableNumber);
}
