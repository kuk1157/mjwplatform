package com.pudding.base.domain.memberLog.entity;


import com.fasterxml.jackson.databind.ser.Serializers;
import com.pudding.base.domain.common.entity.BaseTimeEntity;
import com.pudding.base.domain.common.enums.ActType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="member_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberLog extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "member_id")
    @Schema(description = "사용자 고유번호")
    private Integer memberId;

    @Column(name = "act_type")
    @Schema(description = "활동 타입(로그인, 로그아웃)")
    @Enumerated(EnumType.STRING)
    private ActType actType;

    @Column(name = "created_date")
    private LocalDate createdDate;   // 생성일 통계 검색용도
    @Override
    @PrePersist
    public void prePersist() {
        super.prePersist(); // BaseTimeEntity의 createdAt 설정
        this.createdDate = LocalDate.now(); // 통계용 날짜
    }

    @Builder
    public MemberLog(Integer id, Integer memberId, ActType actType){
        this.id = id;
        this.memberId = memberId;
        this.actType = actType;
    }
}
