package com.pudding.base.domain.platformConfig.repository;

import com.pudding.base.domain.platformConfig.entity.PlatformConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatformConfigRepository extends JpaRepository<PlatformConfig, Integer> {
}
