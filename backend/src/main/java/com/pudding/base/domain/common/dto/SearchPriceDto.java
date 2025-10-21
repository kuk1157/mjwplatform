package com.pudding.base.domain.common.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SearchPriceDto {
    private List<PriceCount> daily;    // 일별
    private List<PriceCount> monthly;  // 월별
    private List<PriceCount> yearly;   // 년별
    private long customCount;         // 검색 기간 총합

    @Builder
    public SearchPriceDto(List<PriceCount> daily, List<PriceCount> monthly, List<PriceCount> yearly, long customCount){
        this.daily = daily;
        this.monthly = monthly;
        this.yearly = yearly;
        this.customCount = customCount;
    }
}
