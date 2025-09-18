package com.pudding.base.domain.auth.controller;

import com.pudding.base.domain.auth.dto.AuthRequestDto;
import com.pudding.base.domain.auth.dto.AuthResponseDto;
import com.pudding.base.domain.auth.dto.DidLoginResponseDto;
import com.pudding.base.domain.auth.service.AuthService;
import com.rootlab.did.ClaimInfo;
import com.rootlab.did.DidLogin;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "점주 로그인", description = "로그인 후 토큰 반환")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDto request) {
        AuthResponseDto responseDto = this.authService.login(request);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
    @Operation(summary = "관리자 로그인", description = "role 체크 후 토큰 반환")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody AuthRequestDto request) {
        AuthResponseDto responseDto = this.authService.adminLogin(request);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("REFRESH_TOKEN") String refreshToken) {
        String newAccessToken = this.authService.refreshToken(refreshToken);
        return ResponseEntity.status(HttpStatus.OK).body(newAccessToken);
    }

    @Operation(summary = "다대구 ID 로그인", description = "QR 로그인 후 사용자 정보 복호화 및 토큰 반환")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공",
                    content = {@Content(schema = @Schema(implementation = AuthResponseDto.class))}),
            @ApiResponse(responseCode = "500", description = "복호화 실패")
    })
    @PostMapping("/did/{storeId}/{tableNumber}")
    public ResponseEntity<?> daeguIdLogin(@RequestBody Map<String, String> request, @PathVariable Integer storeId, @PathVariable Integer tableNumber) {
        try {
            String returnData = request.get("returnData");
            String privateKey = loadPrivateKey(); // 복호화 키
            String cleanKey  = privateKey
                                .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                                .replace("-----END RSA PRIVATE KEY-----", "")
                                .replaceAll("\\s", ""); // 줄바꿈, 공백 제거

            // 다대구 로그인 정보 DID, CI, 이름 등
            ClaimInfo claimInfo = DidLogin.decryptData(returnData, cleanKey );

            // 여기서 DidLoginResponseDto 전체를 받음 (토큰 + customerId)
            DidLoginResponseDto response = authService.didLogin(claimInfo, storeId, tableNumber);

//            // did 로그인 후 access 토큰 발급
//            AuthResponseDto token = authService.didLogin(claimInfo, storeId, tableNumber).getAuth();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("다대구 로그인 실패");
        }
    }



    // 복호화 key load
    private String loadPrivateKey() throws IOException {
        InputStream inputStream = new ClassPathResource("keys/private.pem").getInputStream();
        return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    }
}