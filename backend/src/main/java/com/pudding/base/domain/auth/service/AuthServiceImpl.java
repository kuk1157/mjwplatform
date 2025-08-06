package com.pudding.base.domain.auth.service;

import com.pudding.base.domain.auth.dto.AuthRequestDto;
import com.pudding.base.domain.auth.dto.AuthResponseDto;
import com.pudding.base.domain.auth.entity.Auth;
import com.pudding.base.domain.auth.repository.AuthRepository;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.enums.Role;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.security.CustomUserInfoDto;
import com.pudding.base.security.JwtUtil;
import com.rootlab.did.ClaimInfo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;
    private final AuthRepository authRepository;
    private final PasswordEncoder encoder;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public AuthResponseDto login(AuthRequestDto dto) {
        return authenticate(dto, false);
    }

    @Override
    @Transactional
    public AuthResponseDto didLogin(ClaimInfo info) {
        Optional<Member> optional = memberRepository.findByDid(info.getDid());

        Member member = optional.orElseGet(() -> {
            Member newMember = Member.builder()
                    .did(info.getDid())
                    .name(info.getName())
                    //.phoneNumber(info.getPhoneNumber())
                    //.gender(info.getGender())
                    //.ci(info.getCi())
                    .role(Role.valueOf("user"))
                    .build();
            return memberRepository.save(newMember);
        });


        // 로그인 로그 기록
//        memberLogRepository.save(MemberLog.builder()
//                .memberId(member.getId())
//                .actType(ActType.login)
//                .build());

        // 토큰 생성
        CustomUserInfoDto userInfo = modelMapper.map(member, CustomUserInfoDto.class);
        String accessToken = jwtUtil.createAccessToken(userInfo);
        String refreshToken = jwtUtil.createRefreshToken(userInfo);

        Auth auth;
        if (authRepository.existsByMember(member)) {
            auth = member.getAuth();
            auth.updateAccessToken(accessToken);
            auth.updateRefreshToken(refreshToken);
        } else {
            auth = authRepository.save(Auth.builder()
                    .member(member)
                    .tokenType("Bearer")
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build());
        }

        return new AuthResponseDto(auth);
    }

    @Transactional
    public AuthResponseDto adminLogin(AuthRequestDto dto) {
        return authenticate(dto, true);
    }

    private AuthResponseDto authenticate(AuthRequestDto dto, boolean isAdmin) {
        String loginId = dto.getLoginId();
        String password = dto.getPassword();
        Member member = memberRepository.findByLoginIdAndIsActive(loginId, IsActive.y);
        if (member == null) {
            throw new UsernameNotFoundException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        if (!encoder.matches(password, member.getPassword())) {
            throw new BadCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        if (isAdmin && member.getRole() != Role.admin) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        CustomUserInfoDto info = modelMapper.map(member, CustomUserInfoDto.class);
        String accessToken = jwtUtil.createAccessToken(info);
        String refreshToken = jwtUtil.createRefreshToken(info);

        Auth auth;
        if (authRepository.existsByMember(member)) {
            auth = member.getAuth();
            auth.updateAccessToken(accessToken);
            auth.updateRefreshToken(refreshToken);
        } else {
            auth = authRepository.save(Auth.builder()
                    .member(member)
                    .tokenType("Bearer")
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build());
        }

        return new AuthResponseDto(auth);
    }

    /** Token 갱신 */
    @Transactional
    public String refreshToken(String refreshToken) {
        if (this.jwtUtil.validateToken(refreshToken)) {
            Auth auth = this.authRepository.findByRefreshToken(refreshToken).orElseThrow(
                    () -> new IllegalArgumentException("해당 REFRESH_TOKEN 을 찾을 수 없습니다.\nREFRESH_TOKEN = " + refreshToken));

            Member member = auth.getMember(); // ✅ 명시적 연결
            CustomUserInfoDto info = modelMapper.map(member, CustomUserInfoDto.class); // ✅ member 기준으로 토큰 생성

            String newAccessToken = this.jwtUtil.createAccessToken(info);
            auth.updateAccessToken(newAccessToken);

            return newAccessToken;
        }

        return null;
    }
}