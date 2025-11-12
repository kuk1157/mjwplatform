package com.pudding.base.domain.faq.service;


import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.faq.dto.FaqDto;
import com.pudding.base.domain.faq.entity.Faq;
import com.pudding.base.domain.faq.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FaqServiceImpl implements FaqService {
    private final FaqRepository faqRepository;

    // FAQ 등록
    @Transactional
    @Override
    public FaqDto createFaq(FaqDto.Request faqDto){
        Faq faq = Faq.builder()
                .question(faqDto.getQuestion())
                .answer(faqDto.getAnswer())
                .build();
        Faq savedFaq = faqRepository.save(faq);
        return FaqDto.fromEntity(savedFaq);
    }

    // FAQ 수정
    @Transactional
    @Override
    public FaqDto updateFaq(FaqDto.Request faqDto, Integer id){
        Faq faq = faqRepository.findById(id).orElseThrow(()-> new CustomException("존재하지 않는 FAQ 입니다."));
        faq.updateFaqInfo(faqDto.getQuestion(), faq.getAnswer());
        faqRepository.save(faq);
        return FaqDto.fromEntity(faq);
    }


    @Override
    public Page<FaqDto> getAllFaq(Pageable pageable, String keyword) {
        Page<Faq> faqPage = faqRepository.findAll(pageable, keyword);
        return faqPage.map(FaqDto::fromEntity); // DTO 변환
    }


    // Faq 상세 보기
    @Override
    public FaqDto getFaqById(Integer id){
        Faq faq = faqRepository.findById(id).orElseThrow(()-> new CustomException("존재하지 않는 FAQ 입니다."));
        return FaqDto.fromEntity(faq);
    }

    // Faq 삭제
    @Transactional
    @Override
    public FaqDto deleteFaq(Integer id) {
        Faq faq = faqRepository.findById(id).orElseThrow(()-> new CustomException("존재하지 않는 FAQ 입니다."));
        faq.updateIsActive(IsActive.n);
        faqRepository.save(faq);
        return FaqDto.fromEntity(faq);
    }
}
