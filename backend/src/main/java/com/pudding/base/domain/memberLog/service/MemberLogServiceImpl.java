package com.pudding.base.domain.memberLog.service;


import com.pudding.base.domain.common.dto.DateCount;
import com.pudding.base.domain.common.dto.SearchDateDto;
import com.pudding.base.domain.memberLog.repository.MemberLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberLogServiceImpl implements MemberLogService{

    private final MemberLogRepository memberLogRepository;

    // 접속 통계 - 전체 데이터 갯수 조회(검색일 넣기)
    @Override
    public SearchDateDto trafficCount(LocalDate start, LocalDate end){
        List<DateCount> daily = memberLogRepository.countDaily(start, end);
        List<DateCount> monthly = memberLogRepository.countMonthly(start, end);
        List<DateCount> yearly = memberLogRepository.countYearly(start, end);

        long customCount = daily.stream().mapToLong(DateCount::getCount).sum();

        return SearchDateDto.builder()
                .daily(daily)
                .monthly(monthly)
                .yearly(yearly)
                .customCount(customCount)
                .build();
    }



}
