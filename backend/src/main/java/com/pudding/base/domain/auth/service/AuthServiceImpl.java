package com.pudding.base.domain.auth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pudding.base.crypto.service.EncMetaManager;
import com.pudding.base.dchain.DaeguChainClient;
import com.pudding.base.domain.didLoginProcessor.DidLoginProcessor;
import com.pudding.base.domain.auth.dto.AuthRequestDto;
import com.pudding.base.domain.auth.dto.AuthResponseDto;
import com.pudding.base.domain.auth.dto.DidLoginResponseDto;
import com.pudding.base.domain.auth.entity.Auth;
import com.pudding.base.domain.auth.repository.AuthRepository;
import com.pudding.base.domain.common.enums.ActType;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.enums.Role;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.memberLog.entity.MemberLog;
import com.pudding.base.domain.memberLog.repository.MemberLogRepository;
import com.pudding.base.domain.nft.service.NftService;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.storeStamp.service.StoreStampService;
import com.pudding.base.domain.visit.repository.VisitLogRepository;
import com.pudding.base.domain.visit.service.VisitLogService;
import com.pudding.base.domain.visit.service.VisitLogServiceImpl;
import com.pudding.base.security.CustomUserInfoDto;
import com.pudding.base.security.JwtUtil;
import com.rootlab.did.ClaimInfo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


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
    private final VisitLogRepository visitLogRepository;
    private final StoreRepository storeRepository;
    private final VisitLogServiceImpl logService;
    private final ObjectMapper objectMapper;
    private final NftService nftService;
    private final EncMetaManager encMetaManager;
    private final MemberLogRepository memberLogRepository;
    private final StoreStampService storeStampService;
    private final DidLoginProcessor didLoginProcessor;

    @Override
    @Transactional
    public DidLoginResponseDto didLogin(ClaimInfo info, Integer storeId, Integer tableNumber) {
        // 회원 등록 혹은 조회
        Member member = memberRepository.findByDid(info.getDid())
                .orElseGet(() -> memberRepository.save(Member.builder()
                        .did(info.getDid())
                        .name(info.getName())
                        .phoneNumber(info.getPhoneNumber())
                        .role(Role.user)
                        .build()));

        if (member.getRole() != Role.user) {
            throw new IllegalArgumentException("고객만 연동 로그인이 가능합니다.");
        }

        // 고객 등록
        Customer customer = customerRepository.findByDid(info.getDid())
                .orElseGet(() -> customerRepository.save(Customer.builder()
                        .did(info.getDid())
                        .memberId(member.getId())
                        .storeId(storeId)
                        .build()));

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

        // memberLog 남기기 (접속통계용)
        memberLogRepository.save(MemberLog.builder()
                .memberId(member.getId())
                .actType(ActType.LOGIN)
                .build());

        //
        didLoginProcessor.processAsync(member, storeId, tableNumber);

        return new DidLoginResponseDto(new AuthResponseDto(auth), customer.getId());
    }

    // 관리자, 점주 로그인 공통 예외처리
    private Member authenticateBase(AuthRequestDto dto) {
        String loginId = dto.getLoginId();
        String password = dto.getPassword();
        Member member = memberRepository.findByLoginIdAndIsActive(loginId, IsActive.y);
        if (member == null) {
            throw new UsernameNotFoundException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        if (!encoder.matches(password, member.getPassword())) {
            throw new BadCredentialsException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    // 로그인 성공 후 반환 값
    private AuthResponseDto generateAuthResponse(Member member) {
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

        // 활동기록 객체 생성
        MemberLog memberLog = MemberLog.builder()
                .memberId(member.getId())
                .actType(ActType.LOGIN)
                .build();
        // 활동기록 등록
        memberLogRepository.save(memberLog);


        return new AuthResponseDto(auth);
    }

    // 관리자 로그인
    @Transactional
    public AuthResponseDto adminLogin(AuthRequestDto dto) {
        Member member = authenticateBase(dto);
        if (member.getRole() != Role.admin) {
            throw new CustomException("관리자 권한이 아닙니다. 아이디의 권한을 확인해주세요.");
        }
        return generateAuthResponse(member);
    }

    // 점주 로그인
    @Transactional
    public AuthResponseDto login(AuthRequestDto dto) {
        Member member = authenticateBase(dto);
        if (member.getRole() != Role.owner) {
            throw new CustomException("점주 권한이 아닙니다. 아이디의 권한을 확인해주세요.");
        }
        return generateAuthResponse(member);
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