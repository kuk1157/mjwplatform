package com.pudding.base.domain.common.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SearchDateDto {
    private List<DateCount> daily;    // 일별
    private List<DateCount> monthly;  // 월별
    private List<DateCount> yearly;   // 년별
    private long customCount;         // 검색 기간 총합

    @Builder
    public SearchDateDto(List<DateCount> daily, List<DateCount> monthly, List<DateCount> yearly, long customCount){
        this.daily = daily;
        this.monthly = monthly;
        this.yearly = yearly;
        this.customCount = customCount;
    }
}
