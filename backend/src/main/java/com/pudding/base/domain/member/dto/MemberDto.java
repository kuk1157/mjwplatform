package com.pudding.base.domain.member.dto;

import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.enums.Gender;
import com.pudding.base.domain.member.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberDto {

    private Integer id;
    private String loginId;
    private String name;
    private Gender gender;
    private LocalDate birthday;
    private Role role;
    private String email;
    private String phoneNumber;
    private Integer totalPoint; // 점주 합계 포인트
    private Integer totalCash; // 점주 합계 현금
    private LocalDateTime createdAt;
    private IsActive isActive;

    @Builder
    public MemberDto(Integer id, String loginId, String name, Gender gender, LocalDate birthday, Role role, String email, String phoneNumber,
                     Integer totalPoint, Integer totalCash, LocalDateTime createdAt, IsActive isActive) {
        this.id = id;
        this.loginId = loginId;
        this.name = name;
        this.gender = gender;
        this.birthday = birthday;
        this.role = role;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.totalPoint = totalPoint;
        this.totalCash = totalCash;
        this.createdAt = createdAt;
        this.isActive = isActive;
    }

    // 엔티티에서 DTO로 변환하는 메서드
    public static MemberDto fromEntity(Member member) {
        return MemberDto.builder()
                .id(member.getId())
                .loginId(member.getLoginId())
                .name(member.getName())
                .gender(member.getGender())
                .birthday(member.getBirthday())
                .role(member.getRole())
                .email(member.getEmail())
                .phoneNumber(member.getPhoneNumber())
                .totalPoint(member.getTotalPoint())
                .totalCash(member.getTotalCash())
                .createdAt(member.getCreatedAt())
                .isActive(member.getIsActive())
                .build();
    }

    // DTO에서 엔티티로 변환하는 메서드
    public Member toEntity() {
        return Member.builder()
                .loginId(this.loginId)
                .name(this.name)
                .gender(this.gender)
                .birthday(this.birthday)
                .role(this.role)
                .email(this.email)
                .phoneNumber(this.phoneNumber)
                .build();
    }

    // 회원가입 요청 DTO
    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Request {
        @NotBlank(message = "로그인 ID를 입력해주세요.")
        @Schema(description = "로그인 ID", example = "rhakckator")
        private String loginId;

        @NotBlank
        @Schema(description = "비밀번호", example = "test123!")
        @Pattern(regexp="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
                message = "비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
        private String password;

        @NotBlank(message = "사용자 이름을 입력해주세요.")
        @Size(min = 3, max = 15, message = "사용자 이름은 3자 이상 15글자 이하로 입력해야 합니다.")
        @Schema(description = "사용자 이름", example = "김청우")
        private String name;

        private String email;
        private String phoneNumber;

        private Gender gender;
        private LocalDate birthday;
        private Role role;

        @Builder
        public Request(String loginId, String password, String name, Gender gender,
                       LocalDate birthday, Role role, String email, String phoneNumber) {
            this.loginId = loginId;
            this.password = password;
            this.name = name;
            this.gender = gender;
            this.birthday = birthday;
            this.role = role;
            this.email = email;
            this.phoneNumber = phoneNumber;
        }

        public Member toEntity() {
            return Member.builder()
                    .loginId(this.loginId)
                    .password(this.password)
                    .name(this.name)
                    .gender(this.gender)
                    .birthday(this.birthday)
                    .role(this.role)
                    .email(this.email)
                    .phoneNumber(this.phoneNumber)
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class FindPasswordRequest {
        @NotBlank(message = "로그인 ID를 입력해주세요.")
        @Schema(description = "로그인 ID", example = "rhakckator")
        private String loginId;

        @NotBlank
        @Schema(description = "비밀번호", example = "test123!")
        @Pattern(regexp="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
                message = "비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
        private String password;

        private String email;

        @Builder
        public FindPasswordRequest(String loginId, String password, String email) {
            this.loginId = loginId;
            this.password = password;
            this.email = email;
        }

        public Member toEntity() {
            return Member.builder()
                    .loginId(this.loginId)
                    .password(this.password)
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class PasswordRequest {
        @NotBlank
        @Schema(description = "비밀번호", example = "test123!")
        @Pattern(regexp="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
                message = "비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
        private String password;

        @NotBlank(message = "새로운 비밀번호를 입력해주세요.")
        @Schema(description = "새 비밀번호", example = "test123!!")
        @Pattern(regexp="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
                message = "비밀번호는 영문 대,소문자와 숫자, 특수기호가 적어도 1개 이상씩 포함된 8자 ~ 20자의 비밀번호여야 합니다.")
        private String newPassword;


        @Builder
        public PasswordRequest(String password, String newPassword) {
            this.password = password;
            this.newPassword = newPassword;
        }

        public Member toEntity() {
            return Member.builder()
                    .password(this.password)
                    .build();
        }
    }

    @Getter
    public class ErrorResponse {

        private final String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }
}
