package com.pudding.base.domain.member.controller;

import com.pudding.base.domain.member.dto.MemberDto;
import com.pudding.base.domain.member.exception.MemberValidateException;
import com.pudding.base.domain.member.service.MemberService;
import com.pudding.base.security.JwtUtil;
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

@Tag(name = "회원", description = "회원 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/member")
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtTokenProvider;

    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공",
                    content = {@Content(schema = @Schema(implementation = ResponseEntity.class))}),
            @ApiResponse(responseCode = "404", description = "실패"),
    })

    @Operation(summary = "회원 가입", description = "회원 가입 후 MemberDto 객체 반환")
    @PostMapping()
    public ResponseEntity<?> createMember(@RequestBody MemberDto.Request memberDto) {
        try {
            MemberDto savedMember = memberService.createMember(memberDto);

            return ResponseEntity.ok(savedMember);
        } catch (MemberValidateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @Operation(summary = "아이디 중복 체크", description = "아이디 중복 체크 후 true(사용가능), false(사용중인 아이디 존재) 반환")
    @PostMapping("/check")
    public ResponseEntity<Boolean> checkLoginId(@RequestParam String loginId) {
        boolean isAvailable = memberService.checkLoginId(loginId);
        if (isAvailable) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

    // 사용자 등록 기능으로 들어가는 이메일 중복 확인 기능
    @Operation(summary = "이메일 중복 체크", description = "이메일 중복 체크 후 true(사용가능), false(사용중인 이메일 존재) 반환")
    @PostMapping("/checkEmail")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean isAvailable = memberService.checkEmail(email);
        if (isAvailable) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }




    @Operation(summary = "회원 정보 조회", description = "accessToken 값으로 회원 정보 조회")
    @GetMapping()
    public ResponseEntity<MemberDto> findMember(@RequestHeader("Authorization") String accessToken) {
        Integer id = this.jwtTokenProvider.getUserId(accessToken.substring(7));
        MemberDto memberDto = this.memberService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(memberDto);
    }

    @Operation(summary = "회원 정보 수정", description = "accessToken 값으로 회원 정보 수정")
    @PutMapping()
    public ResponseEntity<MemberDto> updateUser(@RequestHeader("Authorization") String accessToken,
                                                @RequestBody MemberDto memberDto) {
        this.memberService.updateMember(accessToken, memberDto);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @Operation(summary = "아이디 찾기", description = "아이디 찾기 이메일 전송")
    @Parameter(name = "email")
    @PostMapping("findLoginId")
    public void  findLoginId(@RequestBody MemberDto memberDto) {
        memberService.findLoginId(memberDto);
    }

    @Operation(summary = "비밀번호 찾기", description = "이메일 인증 후 비밀번호 변경")
    @Parameter(name = "loginId")
    @Parameter(name = "password")
    @PostMapping("findPassword")
    public void  updateFindPassword(@RequestBody MemberDto.FindPasswordRequest memberDto) {
        memberService.updateFindPassword(memberDto);
    }

    @Operation(summary = "비밀번호 변경", description = "이메일 인증 후 비밀번호 변경")
    @Parameter(name = "password")
    @Parameter(name = "newPassword")
    @PostMapping("updatePassword")
    public void  updatePassword(@RequestHeader("Authorization") String accessToken, @RequestBody MemberDto.PasswordRequest memberDto) {
        memberService.updatePassword(accessToken, memberDto);
    }

    // 회원 탈퇴
    @Operation(summary = "회원 탈퇴", description = "회원 활성화 여부 수정")
    @DeleteMapping("/deleteMember")
    public void deleteMember(@RequestHeader("Authorization") String accessToken) {
        memberService.deleteMember(accessToken);
    }
}