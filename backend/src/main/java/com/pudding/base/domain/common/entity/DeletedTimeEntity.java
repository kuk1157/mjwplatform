package com.pudding.base.domain.common.entity;

import com.pudding.base.domain.common.enums.IsActive;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
public abstract class DeletedTimeEntity {

    @Column(name = "is_active")
    @Enumerated(EnumType.STRING)
    private IsActive isActive;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public void updateIsActive(IsActive isActive) {
        if(isActive == IsActive.n) {
            this.deletedAt = LocalDateTime.now();
        }
        this.isActive = isActive;
    }
}
