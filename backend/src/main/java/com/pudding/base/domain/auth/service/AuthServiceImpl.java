package com.pudding.base.domain.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pudding.base.crypto.service.EncMetaManager;
import com.pudding.base.dchain.DaeguChainClient;
import com.pudding.base.dchain.dto.DaeguChainNftMetadataDto;
import com.pudding.base.domain.auth.dto.AuthRequestDto;
import com.pudding.base.domain.auth.dto.AuthResponseDto;
import com.pudding.base.domain.auth.dto.DidLoginResponseDto;
import com.pudding.base.domain.auth.entity.Auth;
import com.pudding.base.domain.auth.repository.AuthRepository;
import com.pudding.base.domain.common.enums.ActType;
import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.common.enums.IsPaymentStatus;
import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.enums.Role;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.memberLog.entity.MemberLog;
import com.pudding.base.domain.memberLog.repository.MemberLogRepository;
import com.pudding.base.domain.nft.entity.Nft;
import com.pudding.base.domain.nft.service.NftService;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.storeStamp.repository.StoreStampRepository;
import com.pudding.base.domain.storeStamp.service.StoreStampService;
import com.pudding.base.domain.visit.dto.VisitLogDto;
import com.pudding.base.domain.visit.entity.VisitLog;
import com.pudding.base.domain.visit.repository.VisitLogRepository;
import com.pudding.base.domain.visit.service.VisitLogService;
import com.pudding.base.domain.visit.service.VisitLogServiceImpl;
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
import java.nio.charset.StandardCharsets;
import java.util.*;


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


        Integer visitCount = visitLogRepository.findByVisitCount(storeId, customer.getId());
        // 방문기록 생성 (did, storeId, tableNumber 직접 전달)
        VisitLogDto visitLogDto = visitLogService.createVisitLog(info.getDid(), storeId, tableNumber);
        // 점주가 해당 고객의 결제 처리를 하지 않았을 경우,
        if (visitCount != 0) {
            VisitLog visitStatusUpdate = visitLogRepository.findById(visitLogDto.getId()).orElseThrow(() -> new CustomException("존재하지 않는 방문 기록입니다."));
            visitStatusUpdate.updatePaymentStatus();
        }

        // 소켓 emit 판단
        VisitLog latestVisitLog = visitLogRepository.findById(visitLogDto.getId())
                .orElseThrow(() -> new CustomException("방문 기록 없음"));
        // n,n 일때만 emit
        if (latestVisitLog.getPaymentStatus() == IsPaymentStatus.n
                && latestVisitLog.getVisitStatus() == IsVisitStatus.n) {
            logService.sendToSocketServer(VisitLogDto.fromEntity(latestVisitLog, member.getName()));
        }



        // 점주의 고유번호 추출을 위한 객체 호출
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new CustomException("존재하지 않는 매장입니다."));

        // 점주 지갑 주소를 위한 객체 호출
        Member ownerInfo = memberRepository.findById(store.getOwnerId()).orElseThrow(() -> new CustomException("존재하지 않는 점주입니다."));



        String contractAddress = store.getNftContract(); // 매장 nft 계약주소


        // [ NFT collection_info API 실행]
        Map<String, Object> collectionResult = null; // 예외 처리를 위한 collection_info 객체 초기화
        String imgUri = null;
        if(contractAddress != null){
            collectionResult = daeguChainClient.nftCollectionInfo(contractAddress);
            JsonNode root = objectMapper.valueToTree(collectionResult);
            imgUri = root.path("data").path("info").path("policy").path("uri").asText();
        }else{
            throw new RuntimeException("NFT 이미지 추출을 실패하였습니다.");
        }
        System.out.println("NFT image uri"+imgUri);


        // [json 메타데이터 세팅]
        String json = null;
        String schemaId = "sv.v1";
        String type = "store_visit";
        String name = "Store Visit Badge";
        String storeName = store.getName();
        String metadataFileName = storeName+" 체크인 증명";
        String store_id = String.valueOf(storeId); // 매장번호 형변환 (issuer)
        // 아래에 NFT Mint 에도 동시사용
        String customerWallet = Objects.requireNonNull(savedCustomer).getWalletAddress(); // 고객의 지갑 주소(holder)
        String table_id = String.valueOf(tableNumber); // 테이블번호 형변환(visit)
        String checkInTime = String.valueOf(visitLogDto.getCreatedAt()); // 방문시간 형변환(visit)
        // T만 제거
        String formattedTime = checkInTime.replace("T", " ");
        // 암호화
        EncMetaManager.EncryptResult encResult = null;
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
            System.out.println("암호화, 복호화 전 JSON: " + json);


            // [ json 암호화 ]
            byte[] plainBytes = json.getBytes(StandardCharsets.UTF_8);
            try {
                encResult = encMetaManager.encryptBytes(plainBytes);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            System.out.println("Encrypted cipher SHA256: " + encResult.getCipherSha256());
            System.out.println("length: " + encResult.getCipher().length);
            System.out.println("DB meta ID: " + encResult.getId());
            System.out.println("Encrypted bytes: " + encResult.getCipherSha256());



//            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 암호화된 파일
        byte[] encFile = Objects.requireNonNull(encResult).getCipher();


        // [파일업로드 API 실행]
        String fileVisitTime = checkInTime.replaceAll("\\D", ""); // 방문시간 가공
        String fileName ="coex_meta_"+storeId+"_"+tableNumber+"_"+fileVisitTime+ ".enc";  // Json 파일명
        String url = null; // url 초기화
        String fileHash = null; // fileHash 초기화

        System.out.println("파일이름 체크 :"+fileName);

        if (json != null) {
            String description = "test fileUpload";
            Map<String, String> result = daeguChainClient.uploadNftJson(encFile,description,fileName);
            url = result.get("uri");
            fileHash = result.get("fileHash");
        } else {
            throw new RuntimeException("JSON 생성 실패로 NFT 업로드를 진행할 수 없습니다.");
        }

        String nftFileUri = url; // nft 파일업로드 url
        String creator = ownerInfo.getWalletAddress(); // 점주 지갑주소
        String hash = fileHash; // nft 파일 hash

        System.out.println("파일업로드 URL 확인 :"+nftFileUri);




        // [NFT Mint 진행하기]
        Map<String, Object> mintResult = null; // 예외 처리를 위한 NFT Mint 객체 초기화
        String factHash = null; // factHash 초기화(NFT ID 추출을 위해 필요한 값)
        if(nftFileUri != null){

            mintResult = daeguChainClient.nftMint(
                    contractAddress,
                    customerWallet,
                    nftFileUri,
                    creator,
                    hash
            );
            JsonNode root = objectMapper.valueToTree(mintResult);
            factHash = root.path("data").path("tx").path("fact_hash").asText();
        }else{
            throw new RuntimeException("NFT Mint 및 factHash 추출을 실패하였습니다.");
        }

        // [NFT ID API 실행]
        Map<String, Object> nftIdxResult = null; // 예외 처리를 위한 NFT ID 객체 초기화
        Integer nftIdx = null; // nftIdx 초기화(Token Info로 nft 이미지를 가져오기 위한 초기화)
        if(mintResult != null){
            nftIdxResult = daeguChainClient.nftIdx(contractAddress, factHash);
            JsonNode root = objectMapper.valueToTree(nftIdxResult);
            JsonNode nftIdxArray = root.path("data").path("nft_idx");
            // 배열이라면 첫 번째 값 가져오기
            if (nftIdxArray.isArray() && !nftIdxArray.isEmpty()) {
                nftIdx = nftIdxArray.get(0).asInt();
            } else {
                throw new RuntimeException("nft_idx 값이 비어있습니다.");
            }

        }else{
            throw new RuntimeException("NFT ID 추출을 실패하였습니다.");
        }

        // [NFT Token Info API 실행]
        Map<String, Object> nftTokenInfoResult = null; // 예외 처리를 위한 Token Info 객체 초기화
        String nftTokenImageUrl = null; // nft 이미지 값 초기화(최종 nft DB에 저장용도)
        String tokenHash = null; // nft 진위여부 검증 값 초기화 (최종 nft DB에 저장용도)
        if(nftIdx > 0){
            nftTokenInfoResult = daeguChainClient.nftTokenInfo(contractAddress, nftIdx);
            JsonNode root = objectMapper.valueToTree(nftTokenInfoResult);
            nftTokenImageUrl = root.path("data").path("info").path("uri").asText();
            tokenHash = root.path("data").path("info").path("hash").asText();
        }else{
            throw new RuntimeException("Token Info 실행을 실패하였습니다.");
        }

        Integer encId = encResult.getId(); // INT


        // [NFT DB에 저장]
        nftService.createNft(savedCustomer.getDid(), tokenHash, tableNumber, nftIdx, nftTokenImageUrl, encId, storeId, visitLogDto.getCustomerId());

        // [ 가맹점 스탬프 저장(찍기) ]
        storeStampService.createStoreStamps(visitLogDto.getCustomerId(),storeId);

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

        // 활동기록 객체 생성
        MemberLog memberLog = MemberLog.builder()
                .memberId(member.getId())
                .actType(ActType.LOGIN)
                .build();
        // 활동기록 등록
        memberLogRepository.save(memberLog);
        return new DidLoginResponseDto(authResponseDto, visitLogDto.getCustomerId());
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