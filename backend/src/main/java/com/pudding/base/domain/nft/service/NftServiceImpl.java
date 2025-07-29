package com.pudding.base.domain.nft.service;


import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.nft.entity.Nft;
import com.pudding.base.domain.nft.repository.NftRepository;
import com.pudding.base.domain.storeTable.entity.StoreTable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NftServiceImpl implements NftService {

    private final NftRepository nftRepository;
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

        return nfts.stream().map(nft -> NftDto.builder()
                .id(nft.getId())
                .tokenId(nft.getTokenId())
                .storeId(nft.getStoreId())
                .customerId(nft.getCustomerId())
                .createdAt(nft.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

}
