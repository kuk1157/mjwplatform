package com.pudding.base.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(title = "로그인 요청 DTO")
public class AuthRequestDto {

    @NotBlank(message = "로그인 ID를 입력해주세요.")
    @Schema(description = "로그인 ID", example = "rhakckator")
    private String loginId;

    @NotBlank
    @Schema(description = "비밀번호", example = "test123!")
    @Pattern(regexp="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
            message = "비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
    private String password;

    // 엔티티에서 DTO로 변환하는 메서드
//    public static MemberDto fromEntity(Member member) {
//        return MemberDto.builder()
//                .loginId(member.getLoginId())
//                .password()
//                .name(member.getName())
//                .gender(member.getGender())
//                .birthday(member.getBirthday())
//                .build();
//    }

    // DTO에서 엔티티로 변환하는 메서드
//    public Member toEntity() {
//        return Member.builder()
//                .loginId(this.loginId)
//                .password(this.password)
//                .build();
//    }
}
