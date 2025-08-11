package com.pudding.base.domain.auth.service;

import com.pudding.base.dchain.DaeguChainClient;
import com.pudding.base.domain.auth.dto.AuthRequestDto;
import com.pudding.base.domain.auth.dto.AuthResponseDto;
import com.pudding.base.domain.auth.dto.DidLoginResponseDto;
import com.pudding.base.domain.auth.entity.Auth;
import com.pudding.base.domain.auth.repository.AuthRepository;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.enums.Role;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.visit.dto.VisitLogDto;
import com.pudding.base.domain.visit.service.VisitLogService;
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
    private final DaeguChainClient daeguChainClient;
    private final MemberRepository memberRepository;
    private final AuthRepository authRepository;
    private final PasswordEncoder encoder;
    private final ModelMapper modelMapper;

    private final CustomerRepository customerRepository;
    private final VisitLogService visitLogService;


    @Override
    @Transactional
    public AuthResponseDto login(AuthRequestDto dto) {
        return authenticate(dto, false);
    }

    @Override
    @Transactional
    public DidLoginResponseDto didLogin(ClaimInfo info, Integer storeId, Integer tableNumber) {
        Optional<Member> optional = memberRepository.findByDid(info.getDid());
        Member member = optional.orElseThrow(() -> new RuntimeException("Member not found."));

        if(member.getRole() != Role.user){
            throw new IllegalArgumentException("고객만 연동 로그인이 가능합니다.");
        }

        // 로그인 로그 기록
//        memberLogRepository.save(MemberLog.builder()
//                .memberId(member.getId())
//                .actType(ActType.login)
//                .build());


        // 지갑여부 확인
        if (member.getWalletAddress() == null || member.getWalletAddress().isBlank()) {
            // 지갑 생성
            String address = daeguChainClient.createAccountAddress();

            // 동시성 안전을 위해 다시 한 번 확인 후 저장
            if (member.getWalletAddress() == null || member.getWalletAddress().isBlank()) {
                member.setWalletAddress(address);
                memberRepository.save(member);
            }
        }

        // 방문기록 생성 (did, storeId, tableNumber 직접 전달)
        VisitLogDto visitLogDto = visitLogService.createVisitLog(info.getDid(), storeId, tableNumber);

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

        AuthResponseDto authResponseDto = new AuthResponseDto(auth);

        return new DidLoginResponseDto(authResponseDto, visitLogDto.getCustomerId());
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

        if(member.getRole() == Role.admin && !isAdmin){
            throw new IllegalArgumentException("관리자는 로그인 할 수 없습니다.");
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