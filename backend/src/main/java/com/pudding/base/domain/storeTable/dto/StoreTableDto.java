package com.pudding.base.domain.storeTable.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StoreTableDto {
    private Integer id;
    private Integer storeId;
    private Integer tableNumber;
    private LocalDateTime createdAt;

    @Builder
    public StoreTableDto(Integer id, Integer storeId, Integer tableNumber, LocalDateTime createdAt){
        this.id = id;
        this.storeId = storeId;
        this.tableNumber = tableNumber;
        this.createdAt = createdAt;
    }
}
