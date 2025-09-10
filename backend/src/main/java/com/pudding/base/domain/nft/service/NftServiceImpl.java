package com.pudding.base.domain.nft.service;
import com.pudding.base.crypto.entity.EncMetaEntity;
import com.pudding.base.crypto.repository.EncMetaRepository;
import com.pudding.base.crypto.service.EncMetaManager;
import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.nft.entity.Nft;
import com.pudding.base.domain.nft.repository.NftRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
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


    public NftDto createNft(String did, String tokenHash, Integer storeTableId, Integer nftIdx, String nftUrl, Integer encId, Integer storeId, Integer customerId){
        String finalToken = UUID.randomUUID().toString();

        Nft nft = Nft.builder()
                .tokenId(finalToken)
                .tokenHash(tokenHash)
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
                        .storeId(nft.getStoreId())
                        .customerId(nft.getCustomerId())
                        .storeName(storeIdNameMap.get(nft.getStoreId()))
                        .createdAt(nft.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public boolean nftExists(Integer storeId, Integer customerId){
        return nftRepository.existsByStoreIdAndCustomerId(storeId,customerId);
    }

    // NFT 상세보기
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
                throw new RuntimeException("enc 파일 다운로드 실패: " + status);
            }
        } catch (Exception e) {
            throw new CustomException("enc 파일 다운로드 에러");
        }

        // [ NFT 온체인 검증 ]
        String decryptedJson;
        try{
            byte[] plainBytes = encMetaManager.decryptBytes(nft.getEncId(), encBytes);
            decryptedJson = new String(plainBytes, StandardCharsets.UTF_8);
            System.out.println("json 파일 파일"+decryptedJson);
            return nftRepository.findNftById(id);
        }catch(Exception e){
            throw new CustomException("NFT 온체인 검증에 실패하였습니다. \n 메인 페이지로 이동합니다.");
        }
    }
}

