package com.pudding.base.domain.didLoginProcessor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pudding.base.crypto.service.EncMetaManager;
import com.pudding.base.dchain.DaeguChainClient;
import com.pudding.base.dchain.dto.DaeguChainNftMetadataDto;
import com.pudding.base.domain.common.enums.IsPaymentStatus;
import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.nft.service.NftService;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.storeStamp.service.StoreStampService;
import com.pudding.base.domain.visit.dto.VisitLogDto;
import com.pudding.base.domain.visit.entity.VisitLog;
import com.pudding.base.domain.visit.repository.VisitLogRepository;
import com.pudding.base.domain.visit.service.VisitLogService;
import com.pudding.base.domain.visit.service.VisitLogServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class DidLoginProcessor {

    private final MemberRepository memberRepository;
    private final CustomerRepository customerRepository;
    private final VisitLogRepository visitLogRepository;
    private final VisitLogService visitLogService;
    private final StoreRepository storeRepository;
    private final VisitLogServiceImpl sendToSocketServer;
    private final DaeguChainClient daeguChainClient;
    private final EncMetaManager encMetaManager;
    private final ObjectMapper objectMapper;
    private final NftService nftService;
    private final StoreStampService storeStampService;



    @Async
    @Transactional
    public void processAsync(Member member, Integer storeId, Integer tableNumber) {
        try {

            System.out.println(">>> [DidLoginProcessor] processAsync 시작");

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

            Integer customerId = customerRepository.findByDid(member.getDid())
                    .orElseThrow(() -> new CustomException("고객정보 조회 실패"))
                    .getId();

            Integer visitCount = visitLogRepository.findByVisitCount(storeId, customerId);

            // 방문기록 생성 (did, storeId, tableNumber 직접 전달)
            VisitLogDto visitLogDto = visitLogService.createVisitLog(member.getDid(), storeId, tableNumber);

            // 점주가 해당 고객의 결제 처리를 하지 않았을 경우,
            if (visitCount != 0) {
                VisitLog visitStatusUpdate = visitLogRepository.findById(visitLogDto.getId())
                        .orElseThrow(() -> new CustomException("존재하지 않는 방문 기록입니다."));
                visitStatusUpdate.updatePaymentStatus();
            }

            // 소켓 emit 판단
            VisitLog latestVisitLog = visitLogRepository.findById(visitLogDto.getId())
                    .orElseThrow(() -> new CustomException("방문 기록 없음"));
            // n,n 일때만 emit
            if (latestVisitLog.getPaymentStatus() == IsPaymentStatus.n
                    && latestVisitLog.getVisitStatus() == IsVisitStatus.n) {
                sendToSocketServer.sendToSocketServer(VisitLogDto.fromEntity(latestVisitLog, member.getName()));
            }

            // 점주의 고유번호 추출을 위한 객체 호출
            Store store = storeRepository.findById(storeId)
                    .orElseThrow(() -> new CustomException("존재하지 않는 매장입니다."));

            // 점주 지갑 주소를 위한 객체 호출
            Member ownerInfo = memberRepository.findById(store.getOwnerId())
                    .orElseThrow(() -> new CustomException("존재하지 않는 점주입니다."));

            String contractAddress = store.getNftContract(); // 매장 nft 계약주소

            // [ NFT collection_info API 실행]
            Map<String, Object> collectionResult = null; // 예외 처리를 위한 collection_info 객체 초기화
            String imgUri = null;
            if (contractAddress != null) {
                collectionResult = daeguChainClient.nftCollectionInfo(contractAddress);
                JsonNode root = objectMapper.valueToTree(collectionResult);
                imgUri = root.path("data").path("info").path("policy").path("uri").asText();
            } else {
                throw new RuntimeException("NFT 이미지 추출을 실패하였습니다.");
            }
            System.out.println("NFT image uri" + imgUri);

            // [json 메타데이터 세팅]
            String json = null;
            String schemaId = "sv.v1";
            String type = "store_visit";
            String name = "Store Visit Badge";
            String storeName = store.getName();
            String metadataFileName = storeName + " 체크인 증명";
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
            } catch (Exception e) {
                e.printStackTrace();
            }

            // 암호화된 파일
            byte[] encFile = Objects.requireNonNull(encResult).getCipher();

            // [파일업로드 API 실행]
            String fileVisitTime = checkInTime.replaceAll("\\D", ""); // 방문시간 가공
            String fileName = "coex_meta_" + storeId + "_" + tableNumber + "_" + fileVisitTime + ".enc";  // Json 파일명
            String url = null; // url 초기화
            String fileHash = null; // fileHash 초기화

            System.out.println("파일이름 체크 :" + fileName);

            if (json != null) {
                String description = "test fileUpload";
                Map<String, String> result = daeguChainClient.uploadNftJson(encFile, description, fileName);
                url = result.get("uri");
                fileHash = result.get("fileHash");
            } else {
                throw new RuntimeException("JSON 생성 실패로 NFT 업로드를 진행할 수 없습니다.");
            }

            String nftFileUri = url; // nft 파일업로드 url
            String creator = ownerInfo.getWalletAddress(); // 점주 지갑주소
            String hash = fileHash; // nft 파일 hash

            System.out.println("파일업로드 URL 확인 :" + nftFileUri);

            // [NFT Mint 진행하기]
            Map<String, Object> mintResult = null; // 예외 처리를 위한 NFT Mint 객체 초기화
            String factHash = null; // factHash 초기화(NFT ID 추출을 위해 필요한 값)
            if (nftFileUri != null) {

                mintResult = daeguChainClient.nftMint(
                        contractAddress,
                        customerWallet,
                        nftFileUri,
                        creator,
                        hash
                );
                JsonNode root = objectMapper.valueToTree(mintResult);
                factHash = root.path("data").path("tx").path("fact_hash").asText();
            } else {
                throw new RuntimeException("NFT Mint 및 factHash 추출을 실패하였습니다.");
            }

            // [NFT ID API 실행]
            Map<String, Object> nftIdxResult = null; // 예외 처리를 위한 NFT ID 객체 초기화
            Integer nftIdx = null; // nftIdx 초기화(Token Info로 nft 이미지를 가져오기 위한 초기화)
            if (mintResult != null) {
                nftIdxResult = daeguChainClient.nftIdx(contractAddress, factHash);
                JsonNode root = objectMapper.valueToTree(nftIdxResult);
                JsonNode nftIdxArray = root.path("data").path("nft_idx");
                // 배열이라면 첫 번째 값 가져오기
                if (nftIdxArray.isArray() && !nftIdxArray.isEmpty()) {
                    nftIdx = nftIdxArray.get(0).asInt();
                } else {
                    throw new RuntimeException("nft_idx 값이 비어있습니다.");
                }

            } else {
                throw new RuntimeException("NFT ID 추출을 실패하였습니다.");
            }

            // [NFT Token Info API 실행]
            Map<String, Object> nftTokenInfoResult = null; // 예외 처리를 위한 Token Info 객체 초기화
            String nftTokenImageUrl = null; // nft 이미지 값 초기화(최종 nft DB에 저장용도)
            String tokenHash = null; // nft 진위여부 검증 값 초기화 (최종 nft DB에 저장용도)
            if (nftIdx > 0) {
                nftTokenInfoResult = daeguChainClient.nftTokenInfo(contractAddress, nftIdx);
                JsonNode root = objectMapper.valueToTree(nftTokenInfoResult);
                nftTokenImageUrl = root.path("data").path("info").path("uri").asText();
                tokenHash = root.path("data").path("info").path("hash").asText();
            } else {
                throw new RuntimeException("Token Info 실행을 실패하였습니다.");
            }

            Integer encId = encResult.getId(); // INT

            // [NFT DB에 저장]
            nftService.createNft(savedCustomer.getDid(), tokenHash, tableNumber, nftIdx, nftTokenImageUrl, encId, storeId, visitLogDto.getCustomerId());

            // [ 가맹점 스탬프 저장(찍기) ]
            storeStampService.createStoreStamps(visitLogDto.getCustomerId(), storeId);

            System.out.println(">>> [DidLoginProcessor] processAsync 종료");

        } catch (Exception e) {
            log.error("[DidLoginProcessor] 비동기 로그인 후처리 실패: {}", e.getMessage(), e);
        }
    }
}