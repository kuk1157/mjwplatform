package com.pudding.base.domain.member.validator;
import com.pudding.base.domain.member.dto.MemberDto;
import org.springframework.stereotype.Component;

@Component
public class MemberValidator {

    // 회원 정보 검증 로직
    public void validate(MemberDto.Request memberDto) {
        if (memberDto.getLoginId() == null || memberDto.getLoginId().isEmpty()) {
            throw new IllegalArgumentException("로그인 ID는 필수입니다.");
        }
        if (memberDto.getPassword() == null || memberDto.getPassword().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }
        if (memberDto.getName() == null || memberDto.getName().isEmpty()) {
            throw new IllegalArgumentException("이름은 필수입니다.");
        }
        // 다른 검증 로직 추가 가능
    }
}