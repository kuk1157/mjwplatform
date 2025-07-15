package com.pudding.base.domain.email_verify.controller;
import com.pudding.base.domain.email_verify.dto.EmailVerifyDto;
import com.pudding.base.domain.email_verify.exception.EmailVerifyException;
import com.pudding.base.domain.email_verify.service.EmailVerifyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "이메일 인증", description = "이메일 인증 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/emailVerify")
public class EmailVerifyController {

        private final EmailVerifyService emailVerifyService;

        @ApiResponses(value = {
                @ApiResponse(responseCode = "200", description = "성공",
                        content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
                @ApiResponse(responseCode = "404", description = "실패"),
        })

        @Operation(summary = "이메일 인증번호 전송", description = "이메일 인증번호 전송 요청")
        @Parameter(name = "email")
        @PostMapping("send")
        public void sendEmail(@RequestBody EmailVerifyDto.Request emailVerifyDto) {
            emailVerifyService.sendEmail(emailVerifyDto);
        }

        @Operation(summary = "이메일 인증번호 체크", description = "이메일 인증번호 체크")
        @Parameter(name = "email")
        @Parameter(name = "number")
        @PostMapping("verify")
        public ResponseEntity<?> verifyEmail(@RequestBody EmailVerifyDto.Request emailVerifyDto) {
            try {
                return emailVerifyService.verifyEmail(emailVerifyDto);
            } catch (EmailVerifyException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("code", ex.getErrorCode(), "message", ex.getMessage()));
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("code", "UNKNOWN_ERROR", "message", "서버 오류가 발생했습니다."));
            }
        }
    }