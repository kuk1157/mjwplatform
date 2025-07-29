package com.pudding.base.domain.nft.service;


import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.nft.entity.Nft;
import com.pudding.base.domain.nft.repository.NftRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.storeTable.entity.StoreTable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NftServiceImpl implements NftService {

    private final NftRepository nftRepository;
    private final StoreRepository storeRepository;


    public NftDto createNft(String did, Integer storeId, Integer customerId){
        String finalToken = UUID.randomUUID().toString();

        Nft nft = Nft.builder()
                .tokenId(finalToken)
                .storeId(storeId)
                .customerId(customerId)
                .build();

        Nft savedNft = nftRepository.save(nft);
        return NftDto.fromEntity(savedNft);

    }


    public List<NftDto> getAllNft(Integer customerId){
        List<Nft> nfts = nftRepository.findByCustomerId(customerId);

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
                .build()).collect(Collectors.toList());
    }

    public boolean nftExists(Integer storeId, Integer customerId){
        return nftRepository.existsByStoreIdAndCustomerId(storeId,customerId);
    }

}
