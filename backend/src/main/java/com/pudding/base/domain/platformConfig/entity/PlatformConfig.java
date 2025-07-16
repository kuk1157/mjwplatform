package com.pudding.base.domain.platformConfig.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Table(name = "platform_config") // platform_config 테이블 (플랫폼 설정 테이블)
public class PlatformConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Long id;

    @Column(name = "point_rate")
    @Schema(description = "기본 포인트 적립률")
    private Integer pointRate;

    @Column(name = "max_store_price")
    @Schema(description = "매장당 하루 최대 주문금액")
    private Integer maxStorePrice;

    @Column(name = "max_store_point")
    @Schema(description = "매장당 하루 최대 포인트")
    private Integer maxStorePoint;


}
