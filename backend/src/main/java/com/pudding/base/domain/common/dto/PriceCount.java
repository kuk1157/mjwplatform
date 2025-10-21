


package com.pudding.base.domain.common.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PriceCount {
    private LocalDate date;  // YYYY-MM-DD, YYYY-MM, YYYY
    private Long count;
    private Double sumPoint;
    private Long sumOrderPrice;
    private Double avgPoint;
    private Double avgOrderPrice;
    private Double minPoint;
    private Integer minOrderPrice;
    private Double maxPoint;
    private Integer maxOrderPrice;


    // 전체 통계용 생성자
    public PriceCount(Object date, Long count, Double sumPoint, Long sumOrderPrice,
                      Double avgPoint, Double avgOrderPrice,
                      Double minPoint, Integer minOrderPrice,
                      Double maxPoint, Integer maxOrderPrice) {
        this.date = convertToLocalDate(date);
        this.count = count;
        this.sumPoint = sumPoint;
        this.sumOrderPrice = sumOrderPrice;
        this.avgPoint = avgPoint;
        this.avgOrderPrice = avgOrderPrice;
        this.minPoint = minPoint;
        this.minOrderPrice = minOrderPrice;
        this.maxPoint = maxPoint;
        this.maxOrderPrice = maxOrderPrice;
    }

    // 전체 데이터 중 합계 추출 용
    public PriceCount(Double sumPoint, Long sumOrderPrice,
                      Double avgPoint, Double avgOrderPrice,
                      Double minPoint, Integer minOrderPrice,
                      Double maxPoint, Integer maxOrderPrice) {
        this.sumPoint = sumPoint;
        this.sumOrderPrice = sumOrderPrice;
        this.avgPoint = avgPoint;
        this.avgOrderPrice = avgOrderPrice;
        this.minPoint = minPoint;
        this.minOrderPrice = minOrderPrice;
        this.maxPoint = maxPoint;
        this.maxOrderPrice = maxOrderPrice;
    }


    private LocalDate convertToLocalDate(Object date) {
        if (date instanceof LocalDate) return (LocalDate) date;
        if (date instanceof java.sql.Date) return ((java.sql.Date) date).toLocalDate();
        throw new IllegalArgumentException("Unsupported date type: " + date.getClass());
    }
}