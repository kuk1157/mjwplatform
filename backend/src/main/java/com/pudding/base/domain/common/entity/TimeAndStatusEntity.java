package com.pudding.base.domain.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
public abstract class TimeAndStatusEntity extends DeletedTimeEntity {
    @Column(name = "created_at")
    private LocalDateTime createdAt;   // 생성일시

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;  // 최종 수정일시

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.modifiedAt = LocalDateTime.now();
    }
}
