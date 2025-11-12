package com.pudding.base.domain.faq.entity;

import com.pudding.base.domain.common.entity.BaseTimeEntity;
import com.pudding.base.domain.common.entity.TimeAndStatusEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "faq") // faq 테이블
public class Faq extends TimeAndStatusEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "question")
    @Schema(description = "질문")
    private String question;

    @Column(name = "answer")
    @Schema(description = "답변")
    private String answer;


    @Builder
    public Faq(Integer id, String question, String answer){
        this.id = id;
        this.question = question;
        this.answer = answer;
    }

    // faq 수정 (질문, 답변만 수정)
    public void updateFaqInfo(String question, String answer){
        this.question = question;
        this.answer = answer;
    }
}
