package com.pudding.base.domain.nft.controller;


import com.pudding.base.domain.faq.dto.FaqDto;
import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.nft.service.NftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "NFT 트랜잭션 API", description = "NFT 트랜잭션 내역")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/nfts")
public class NftAdminController {

    private final NftService nftService;

    @Operation(summary = "NFT 트랜잭션 API", description = "NFT 트랜잭션 내역")
    @GetMapping
    public ResponseEntity<Page<NftDto>> getNftTransactions(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                                                  @RequestParam(value ="keyword",required = false) String keyword){
        Page<NftDto> getNfts = nftService.getNftTransactions(pageable, keyword);
        return ResponseEntity.ok(getNfts);
    }
}
