package com.pudding.base.domain.nft.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.pudding.base.crypto.repository.EncMetaRepository;
import com.pudding.base.crypto.service.EncMetaManager;
import com.pudding.base.dchain.DaeguChainClient;
import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.nft.entity.Nft;
import com.pudding.base.domain.nft.repository.NftRepository;
import com.pudding.base.domain.nftOnChainLog.entity.NftOnChainLog;
import com.pudding.base.domain.nftOnChainLog.repository.NftOnChainLogRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.BadPaddingException;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NftServiceImpl implements NftService {

    private final NftRepository nftRepository;
    private final StoreRepository storeRepository;
    private final EncMetaRepository encMetaRepository;
    private final EncMetaManager encMetaManager;
    private final NftOnChainLogRepository nftOnChainLogRepository;
    private final DaeguChainClient daeguChainClient;
    private final CustomerRepository customerRepository;
    private final MemberRepository memberRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${daeguchain.timestamp-projectId}")
    private String timeStampProjectId;


    @Transactional
    @Override
    public NftDto createNft(String did, String tokenHash, String mintHash, Integer storeTableId, Integer nftIdx, String nftUrl, Integer encId, Integer storeId, Integer customerId) {
        String finalToken = UUID.randomUUID().toString();

        Nft nft = Nft.builder()
                .tokenId(finalToken)
                .tokenHash(tokenHash)
                .mintHash(mintHash)
                .storeId(storeId)
                .customerId(customerId)
                .storeTableId(storeTableId)
                .nftIdx(nftIdx)
                .nftUrl(nftUrl)
                .encId(encId)
                .build();

        Nft savedNft = nftRepository.save(nft);
        return NftDto.fromEntity(savedNft);

    }


//    // 고객 NFT 전체 조회
//    public List<NftDto> getAllNftSorted(Integer customerId, String sort){
//        List<Nft> nfts = nftRepository.findByCustomerId(customerId);
//
//        List<Integer> storeIds = nfts.stream()
//                .map(Nft::getStoreId)
//                .distinct()
//                .collect(Collectors.toList());
//
//        Map<Integer, String> storeIdNameMap = storeRepository.findAllById(storeIds).stream()
//                .collect(Collectors.toMap(Store::getId, Store::getName));
//
//
//        return nfts.stream().map(nft -> NftDto.builder()
//                .id(nft.getId())
//                .tokenId(nft.getTokenId())
//                .storeId(nft.getStoreId())
//                .customerId(nft.getCustomerId())
//                .storeName(storeIdNameMap.get(nft.getStoreId()))
//                .createdAt(nft.getCreatedAt())
//                .build()).collect(Collectors.toList());
//    }

    @Override
    public List<NftDto> getAllNftSorted(Integer customerId, String sort) {
        // limit 없이 전체 조회하려면 limit = null로 getLimitedNftSorted 호출
        return getLimitedNftSorted(customerId, sort, null);
    }

    // 고객 NFT 전체 조회
    @Override
    public List<NftDto> getLimitedNftSorted(Integer customerId, String sort, Integer limit) {

        // 정렬 direction 세팅
        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(direction, "createdAt");

        List<Nft> nfts;
        if (limit != null) {
            Pageable pageable = PageRequest.of(0, limit, sortObj);
            nfts = nftRepository.findByCustomerId(customerId, pageable).getContent();
        } else {
            nfts = nftRepository.findByCustomerId(customerId, sortObj);
        }
        List<Integer> storeIds = nfts.stream()
                .map(Nft::getStoreId)
                .distinct()
                .collect(Collectors.toList());

        Map<Integer, String> storeIdNameMap = storeRepository.findAllById(storeIds).stream()
                .collect(Collectors.toMap(Store::getId, Store::getName));

        return nfts.stream().map(nft -> NftDto.builder()
                        .id(nft.getId())
                        .tokenId(nft.getTokenId())
                        .mintHash(nft.getMintHash())
                        .storeId(nft.getStoreId())
                        .customerId(nft.getCustomerId())
                        .storeName(storeIdNameMap.get(nft.getStoreId()))
                        .createdAt(nft.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public boolean nftExists(Integer storeId, Integer customerId) {
        return nftRepository.existsByStoreIdAndCustomerId(storeId, customerId);
    }

    // NFT 상세보기
    @Override
    public NftDto getNftById(Integer id) {
        Nft nft = nftRepository.findById(id).orElseThrow(() -> new CustomException("존재하지 않는 NFT 입니다."));
        byte[] encBytes;

        try {
            URL url = new URL(nft.getNftUrl());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            int status = conn.getResponseCode();
            if (status >= 200 && status < 300) {
                try (InputStream in = conn.getInputStream();
                     ByteArrayOutputStream out = new ByteArrayOutputStream()) {

                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = in.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                    }
                    encBytes = out.toByteArray();
                }
            } else {
                encDownloadError(id, "enc 파일 다운로드에러", "NFT 다운로드 실패 (HTTP 상태 코드 " + status + ")", "HTTP 상태: " + status);
                throw new CustomException("enc 파일 다운로드에 실패하였습니다.");
            }
        } catch (Exception e) {
            encDownloadError(id, "enc 파일 다운로드에러", "NFT 다운로드 실패 (알 수 없는 오류)", e.getMessage());
            throw new CustomException("enc 파일 다운로드에 실패하였습니다.");
        }

        // [ NFT 온체인 검증 ]
        // 검증 및 timestamp 준비
        String decryptedJson;
        String txHashMessage = "";
        try {
            // 1. 복호화
            byte[] plainBytes = encMetaManager.decryptBytes(nft.getEncId(), encBytes);
            decryptedJson = new String(plainBytes, StandardCharsets.UTF_8);
            System.out.println("json 파일 내용: " + decryptedJson);

            Map<String, Object> jsonMap;
            try {
                jsonMap = objectMapper.readValue(decryptedJson, new TypeReference<Map<String, Object>>() {
                });
            } catch (Exception e) {
                System.out.println("파싱 실패 JSON: " + decryptedJson);
                e.printStackTrace();
                throw new RuntimeException("JSON 파싱 실패", e);
            }
            Map<String, Object> holderMap = (Map<String, Object>) jsonMap.get("holder");
            String localWallet = holderMap != null ? (String) holderMap.get("wallet") : "";


            Customer customer = customerRepository.findById(nft.getCustomerId()).orElseThrow(() -> new CustomException("존재하지 Customer 입니다."));
            Member member = memberRepository.findById(customer.getMemberId()).orElseThrow(() -> new CustomException("존재하지 member 입니다."));
            String memberWallet = member.getWalletAddress();
            //String chainResHash = nft.getTokenHash();

            if (localWallet.equalsIgnoreCase(memberWallet)) {
                txHashMessage = "Store 체크인 증명(holder 정보 일치) 성공";
            } else {
                txHashMessage = "Store 체크인 증명(holder 정보 불일치) 실패";
            }

            long now = System.currentTimeMillis();

            // 3. Timestamp 데이터 생성
            Map<String, Object> tsJson = new HashMap<>();
            tsJson.put("nftId", nft.getId());
            tsJson.put("txHashMessage", txHashMessage);
            tsJson.put("createdAt", now);

            String timestampData = objectMapper.writeValueAsString(tsJson);
            String tsKey = UUID.randomUUID().toString().replace("-", "").substring(0, 8);

            // 4. Timestamp 요청 및 성공 로그 저장 (비동기)
            String finalTxHashMessage = txHashMessage;
            daeguChainClient.requestTimestampAsync(timeStampProjectId, now, tsKey, timestampData)
                    .subscribe(tsResp -> {
                        String txHash = tsResp.getTxHash();
                        NftOnChainLog nftOnChainLog = NftOnChainLog.builder()
                                .nftId(nft.getId())
                                .onChainCategory("success")
                                .errorType(null)
                                .koreanMsg("온체인 검증 성공")
                                .errorMsg(null)
                                .txHash(txHash)
                                .txHashMessage(finalTxHashMessage)
                                .build();
                        nftOnChainLogRepository.save(nftOnChainLog);
                    });

        } catch (Exception e) {
            // 실패 로그 저장
            String errorType = null;
            String koreanMsg = "NFT 온체인 검증 실패";

            Throwable cause = (e.getCause() != null) ? e.getCause() : e;

            if (cause instanceof InvalidKeyException) {
                errorType = "DECRYPT_KEY_MISMATCH";
                koreanMsg = "NFT 온체인 검증 실패 (복호화 키 불일치)";
            } else if (cause instanceof BadPaddingException) {
                errorType = "DECRYPT_INVALID_PADDING";
                koreanMsg = "NFT 온체인 검증 실패 (잘못된 패딩, enc 파일 손상 가능)";
            } else if (cause instanceof javax.crypto.AEADBadTagException) {
                errorType = "DECRYPT_TAMPERED_DATA";
                koreanMsg = "NFT 온체인 검증 실패 (데이터 위변조 의심)";
            } else {
                errorType = "DECRYPT_UNKNOWN_ERROR";
                koreanMsg = "NFT 온체인 검증 실패 (알 수 없는 오류)";
            }

            NftOnChainLog nftOnChainLog = NftOnChainLog.builder()
                    .nftId(nft.getId())
                    .onChainCategory("onChain Fail")
                    .errorType(errorType)
                    .koreanMsg(koreanMsg)
                    .errorMsg(e.getMessage())
                    .txHash(null)
                    .txHashMessage(txHashMessage.isEmpty() ? "Store 체크인 증명(holder 정보 불일치) 실패" : txHashMessage)
                    .build();
            nftOnChainLogRepository.save(nftOnChainLog);

            throw new CustomException("NFT 온체인 검증에 실패하였습니다.\n메인 페이지로 이동합니다.");
        }

        // 최종 반환
        return nftRepository.findNftById(id);
    }

    private void encDownloadError(Integer nftId, String errorType, String koreanMsg, String errorMsg) {
        NftOnChainLog nftOnChainLog = NftOnChainLog.builder()
                .nftId(nftId)
                .onChainCategory("ENC download fail")
                .errorType(errorType)
                .koreanMsg(koreanMsg)
                .errorMsg(errorMsg)
                .build();
        nftOnChainLogRepository.save(nftOnChainLog);
    }


    // NFT 트랜잭션 내역
    @Override
    public Page<NftDto> getNftTransactions(Pageable pageable, String keyword) {
        return nftRepository.nftTransactions(pageable, keyword);
    }

}

