package com.pudding.base.domain.pointCashOutRequest.dto;

import com.pudding.base.domain.pointCashOutRequest.entity.PointCashOutRequest;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PointCashOutRequestDto {

    private Integer id;
    private Integer storeId;
    private Integer ownerId;
    private Integer cash;
    private LocalDateTime requestAt;

    @Builder
    public PointCashOutRequestDto(Integer id, Integer storeId, Integer ownerId, Integer cash, LocalDateTime requestAt){
        this.id = id;
        this.storeId = storeId;
        this.ownerId = ownerId;
        this.cash = cash;
        this.requestAt = requestAt;
    }

    public static PointCashOutRequestDto fromEntity(PointCashOutRequest pointCashOutRequest) {
        return PointCashOutRequestDto.builder()
                .id(pointCashOutRequest.getId())
                .storeId(pointCashOutRequest.getStoreId())
                .ownerId(pointCashOutRequest.getOwnerId())
                .cash(pointCashOutRequest.getCash())
                .requestAt(pointCashOutRequest.getRequestAt())
                .build();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Request{
        @NotNull(message = "현금화 신청 금액을 입력해주세요.")
        private Integer cash;
        public Request(Integer cash){
            this.cash = cash;
        }
    }

}
