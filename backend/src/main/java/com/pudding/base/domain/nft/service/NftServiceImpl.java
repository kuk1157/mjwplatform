package com.pudding.base.domain.nft.service;
import com.pudding.base.crypto.repository.EncMetaRepository;
import com.pudding.base.crypto.service.EncMetaManager;
import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.nft.entity.Nft;
import com.pudding.base.domain.nft.repository.NftRepository;
import com.pudding.base.domain.nftOnChainLog.entity.NftOnChainLog;
import com.pudding.base.domain.nftOnChainLog.repository.NftOnChainLogRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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


    @Transactional
    @Override
    public NftDto createNft(String did, String tokenHash, String mintHash, Integer storeTableId, Integer nftIdx, String nftUrl, Integer encId, Integer storeId, Integer customerId){
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
    public List<NftDto> getLimitedNftSorted(Integer customerId, String sort, Integer limit){

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
    public boolean nftExists(Integer storeId, Integer customerId){
        return nftRepository.existsByStoreIdAndCustomerId(storeId,customerId);
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
                encDownloadError(id, "DOWNLOAD_HTTP_ERROR", "NFT 다운로드 실패 (HTTP 상태 코드 " + status + ")", "HTTP 상태: " + status);
                throw new CustomException("enc 파일 다운로드에 실패하였습니다.");
            }
        } catch (MalformedURLException e) {
            encDownloadError(id, "DOWNLOAD_URL_INVALID", "NFT 다운로드 실패 (URL 형식 오류)", e.getMessage());
            throw new CustomException("enc 파일 다운로드에 실패하였습니다.");
        } catch (FileNotFoundException e) {
            encDownloadError(id, "DOWNLOAD_FILE_NOT_FOUND", "NFT 다운로드 실패 (파일 없음)", e.getMessage());
            throw new CustomException("enc 파일 다운로드에 실패하였습니다.");
        } catch (IOException e) {
            encDownloadError(id, "DOWNLOAD_IO_ERROR", "NFT 다운로드 실패 (서버 연결 또는 IO 오류)", e.getMessage());
            throw new CustomException("enc 파일 다운로드에 실패하였습니다.");
        } catch (Exception e) {
            encDownloadError(id, "DOWNLOAD_UNKNOWN_ERROR", "NFT 다운로드 실패 (알 수 없는 오류)", e.getMessage());
            throw new CustomException("enc 파일 다운로드에 실패하였습니다.");
        }


        // [ NFT 온체인 검증 ]
        String decryptedJson;
        try {
            byte[] plainBytes = encMetaManager.decryptBytes(nft.getEncId(), encBytes);
            decryptedJson = new String(plainBytes, StandardCharsets.UTF_8);
            System.out.println("json 파일 파일: " + decryptedJson);
        } catch (Exception e) {
            String errorType;
            String koreanMsg;

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
                    .nftId(id)
                    .onChainCategory("onChain Fail")
                    .errorType(errorType)
                    .koreanMsg(koreanMsg)
                    .errorMsg(e.getMessage())
                    .build();
            nftOnChainLogRepository.save(nftOnChainLog);

            throw new CustomException("NFT 온체인 검증에 실패하였습니다.\n메인 페이지로 이동합니다.");
        }

        // 성공 로그는 try-catch 끝난 뒤
        NftOnChainLog nftOnChainLog = NftOnChainLog.builder()
                .nftId(id)
                .onChainCategory("success")
                .errorType(null)
                .koreanMsg("온체인 검증 성공")
                .errorMsg(null)
                .build();
        nftOnChainLogRepository.save(nftOnChainLog);

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

