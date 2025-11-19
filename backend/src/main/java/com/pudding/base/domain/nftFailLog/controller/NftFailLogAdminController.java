package com.pudding.base.domain.nftFailLog.controller;


import com.pudding.base.domain.nftFailLog.dto.NftFailLogDto;
import com.pudding.base.domain.nftFailLog.service.NftFailLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "온체인 검증 실패 로그", description = "온체인 검증 실패 로그")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/nftFailLog")
public class NftFailLogAdminController {
    private final NftFailLogService nftFailLogService;


    @Operation(summary = "온체인 검증 실패 로그 API", description = "온체인 검증 실패 로그")
    @GetMapping
    public ResponseEntity<Page<NftFailLogDto>> getNftFailLogs(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                                                              @RequestParam(value ="keyword",required = false) String keyword){
        Page<NftFailLogDto> nftFailLogs = nftFailLogService.getNftFailLogs(pageable, keyword);
        return ResponseEntity.ok(nftFailLogs);
    }


}
