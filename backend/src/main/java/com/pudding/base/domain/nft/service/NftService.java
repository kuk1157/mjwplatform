package com.pudding.base.domain.nft.service;


import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.store.dto.StoreDto;

import java.util.List;

public interface NftService {

    // nft 등록
    NftDto createNft(String did, String tokenHash, Integer storeTableId, Integer nftIdx, String nftUrl, Integer encId, Integer storeId, Integer customerId);

    // 고객 NFT 전체 조회
    List<NftDto> getAllNftSorted(Integer customerId, String sort);

    // 고객 NFT 최근 2개 조회
    List<NftDto> getLimitedNftSorted(Integer customerId, String sort, Integer limit);

    // nft 고객 매장 기준 조회  - nft 중복 발급 예외 api
    boolean nftExists(Integer storeId, Integer customerId);

    // nft 상세 조회
    NftDto getNftById(Integer id);
}
