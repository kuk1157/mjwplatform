package com.pudding.base.domain.nft.service;


import com.pudding.base.domain.nft.dto.NftDto;

import java.util.List;

public interface NftService {

    // nft 등록
    NftDto createNft(String did, Integer storeId, Integer customerId);

    // nft 고객별 전체 조회
    List<NftDto> getAllNft(Integer customerId);

    // nft 고객 매장 기준 조회  - nft 중복 발급 예외 api
    boolean nftExists(Integer storeId, Integer customerId);
}
