package com.pudding.base.domain.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pudding.base.dchain.DaeguChainClient;
import com.pudding.base.dchain.dto.DaeguChainNftMetadataDto;
import com.pudding.base.domain.auth.dto.AuthRequestDto;
import com.pudding.base.domain.auth.dto.AuthResponseDto;
import com.pudding.base.domain.auth.dto.DidLoginResponseDto;
import com.pudding.base.domain.auth.entity.Auth;
import com.pudding.base.domain.auth.repository.AuthRepository;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.enums.Role;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
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

import java.util.Map;
import java.util.Objects;
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
    private final StoreRepository storeRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public AuthResponseDto login(AuthRequestDto dto) {
        return authenticate(dto, false);
    }

    @Override
    @Transactional
    public DidLoginResponseDto didLogin(ClaimInfo info, Integer storeId, Integer tableNumber) {
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

        if(member.getRole() != Role.user){
            throw new IllegalArgumentException("고객만 연동 로그인이 가능합니다.");
        }

        Customer customer = customerRepository.findByDid(info.getDid())
                .orElseGet(() -> {
                    return customerRepository.save(
                            Customer.builder()
                                    .did(info.getDid())
                                    .memberId(member.getId())
                                    .build()
                    );
                });

        // 로그인 로그 기록
//        memberLogRepository.save(MemberLog.builder()
//                .memberId(member.getId())
//                .actType(ActType.login)
//                .build());


        // 고객 지갑 주소를 위한 Member 객체 초기화
        Member savedCustomer = member;

        // 지갑여부 확인
        if (member.getWalletAddress() == null || member.getWalletAddress().isBlank()) {
            // 지갑 생성
            String address = daeguChainClient.createAccountAddress();

            // 동시성 안전을 위해 다시 한 번 확인 후 저장
            if (member.getWalletAddress() == null || member.getWalletAddress().isBlank()) {
                member.setWalletAddress(address);
                savedCustomer = memberRepository.save(member);
            }
        }

        // 방문기록 생성 (did, storeId, tableNumber 직접 전달)
        VisitLogDto visitLogDto = visitLogService.createVisitLog(info.getDid(), storeId, tableNumber);

        // 점주의 고유번호 추출을 위한 객체 호출
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CustomException("존재하지 않는 매장입니다."));

        // 점주 지갑 주소를 위한 객체 호출
        Member ownerInfo = memberRepository.findById(store.getOwnerId()).orElseThrow(() -> new CustomException("존재하지 않는 점주입니다."));

        // json 메타데이터 세팅
        String json = null;
        String schemaId = "sv.v1";
        String type = "store_visit";
        String name = "Store Visit Badge";
        String metadataFileName = "대구통닭 체크인 증명";
        String store_id = String.valueOf(storeId); // 매장번호 형변환 (issuer)
        // 아래에 NFT Mint 에도 동시사용
        String customerWallet = Objects.requireNonNull(savedCustomer).getWalletAddress(); // 고객의 지갑 주소(holder)
        String table_id = String.valueOf(tableNumber); // 테이블번호 형변환(visit)
        String checkInTime = String.valueOf(visitLogDto.getCreatedAt()); // 방문시간 형변환(visit)
        // T만 제거
        String formattedTime = checkInTime.replace("T", " ");
        try {

            DaeguChainNftMetadataDto dto = new DaeguChainNftMetadataDto(
                    schemaId,
                    type,
                    name,
                    metadataFileName,
                    new DaeguChainNftMetadataDto.Issuer(store_id),
                    new DaeguChainNftMetadataDto.Holder(customerWallet),
                    new DaeguChainNftMetadataDto.Visit(table_id, formattedTime),
                    new DaeguChainNftMetadataDto.Image("", "")
            );

            json = daeguChainClient.createMetadataJson(dto);
            System.out.println(json);
        } catch (Exception e) {
            e.printStackTrace();
        }


        // 방문시간 가공
        String fileVisitTime = checkInTime.replaceAll("\\D", ""); // \D = 숫자가 아닌 모든 문자
        String fileName ="coex_meta_"+storeId+"_"+tableNumber+"_"+fileVisitTime+ ".json";
        String url = null;
        String fileHash = null;
        // 파일업로드 API 실행
        if (json != null) {
            String description = "test fileUpload";
            Map<String, String> result = daeguChainClient.uploadNftJson(Objects.requireNonNull(json),description,fileName);
            url = result.get("uri");
            fileHash = result.get("fileHash");
            System.out.println("업로드 NFT 파일 URI: " + url);
            System.out.println("업로드 NFT 파일 Hash: " + fileHash);
        } else {
            throw new RuntimeException("JSON 생성 실패로 NFT 업로드를 진행할 수 없습니다.");
        }


        String contractAddress = store.getNftContract(); // 매장 nft 계약주소
        String nftFileUri = url; // nft 파일업로드 url
        String creator = ownerInfo.getWalletAddress(); // 점주 지갑주소
        String hash = fileHash; // nft 파일 hash

        // nft 계약주소, 고객지갑주소, 점주지갑주소, nft file uri, fileHash 사용하기
        // nftFileUri, fileHash (2가지는 NFT 파일업로드에서 땡겨온 정보)
        // NFT Mint 진행하기
        Map<String, Object> mintResult = daeguChainClient.nftMint(
                contractAddress,
                customerWallet,
                nftFileUri,
                creator,
                hash
        );
        System.out.println("=== NFT Mint 결과 ===");
        System.out.println(mintResult);

        // NFT ID API 호출을 위한 Mint 결과값에서 factHash 추출
        JsonNode root = objectMapper.valueToTree(mintResult);
        String factHash = root.path("data").path("tx").path("fact_hash").asText();
        System.out.println("드디어 너를 추출한건가 맞음? "+factHash);


        // NFT ID API 실행
        Map<String, Object> nftIdxResult = daeguChainClient.nftIdx(contractAddress, factHash);
        System.out.println("=== NFT ID 결과 ===");
        System.out.println(nftIdxResult);

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