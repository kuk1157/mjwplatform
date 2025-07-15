package com.pudding.base.security;

import com.pudding.base.domain.auth.entity.Auth;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.member.dto.MemberDto;
import com.pudding.base.domain.member.enums.Gender;
import com.pudding.base.domain.member.enums.Role;
import lombok.*;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CustomUserInfoDto extends MemberDto {
    private Integer id;
    private String loginId;
    private String password;
    private String name;
    private Gender gender;
    private LocalDate birthday;
    private IsActive isActive;
    private Role role;
    private Auth auth;
}
