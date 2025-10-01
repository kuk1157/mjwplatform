package com.pudding.base.domain.common.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DateCount {
    private LocalDate date;  // YYYY-MM-DD, YYYY-MM, YYYY
    private Long count;

    public DateCount(Object date, Long count) {
        if (date instanceof LocalDate) {
            this.date = (LocalDate) date;
        } else if (date instanceof java.sql.Date) {
            this.date = ((java.sql.Date) date).toLocalDate();
        } else {
            throw new IllegalArgumentException("Unsupported date type: " + date.getClass());
        }
        this.count = count;
    }
}