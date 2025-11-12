package com.pudding.base.domain.faq.dto;


import com.pudding.base.domain.faq.entity.Faq;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FaqDto {
    private Integer id;
    private String question;
    private String answer;
    private LocalDateTime createdAt;

    @Builder
    public FaqDto(Integer id,String question, String answer, LocalDateTime createdAt){
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.createdAt = createdAt;
    }

    public static FaqDto fromEntity(Faq faq) {
        return FaqDto.builder()
                .id(faq.getId())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .createdAt(faq.getCreatedAt())
                .build();
    }

    @Getter
    @NoArgsConstructor
    public static class Request{

        private String question;
        private String answer;

        public Request(String question, String answer){
            this.question = question;
            this.answer = answer;
        }
    }
}
