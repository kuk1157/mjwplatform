package com.pudding.base.domain.naver.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "네이버 지도 관련 API", description= "네이버 지도 관련 Controller")
@RestController
@Component
@RequiredArgsConstructor
@RequestMapping("/api/v1/naver/maps")
public class NaverMapController {

    @Value("${NaverMap.client-ID}")
    private String clientId;
    @Operation(summary = "네이버 지도 clientID 추출", description = "yml에 저장되어 있는 값 추출")
    @GetMapping()
    public ResponseEntity<String> getNaverMapClientId(){
        return ResponseEntity.ok(clientId);
    }
}
