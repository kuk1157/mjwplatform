package com.pudding.base.domain.member.controller;

import com.pudding.base.domain.member.dto.MemberDto;
import com.pudding.base.domain.member.service.MemberService;
import com.pudding.base.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Tag(name = "회원", description = "회원 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/member")
public class MemberAdminController {

    private final MemberService memberService;
    private final JwtUtil jwtTokenProvider;

    // 전체 회원 조회
    @Operation(summary = "전체 회원 조회", description = "전체 회원 조회, 페이징")
    @GetMapping
    public ResponseEntity<Page<MemberDto>> getMembers(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                                                      @RequestParam(value ="keyword",required = false) String keyword,
                                                      @RequestParam(value ="name",required = false) String name,
                                                      @RequestParam(value ="loginId",required = false) String loginId) {
        Page<MemberDto> members = memberService.findMembers(pageable, keyword, name, loginId);
        return ResponseEntity.ok(members);
    }

    // 회원 권한 수정
    @Operation(summary = "회원 권한 수정", description = "회원 권한 수정 후 memberDto 반환")
    @Parameter(name = "id", description = "권한 수정 할 회원의 ID", required = true)
    @Parameter(name = "role", description = "수정 하려는 권한 값", required = true)
    @PutMapping
    public ResponseEntity<MemberDto> updateMemberRole(@RequestBody MemberDto memberDto) {
        MemberDto updatedMemberRole = memberService.updateMemberRole(memberDto);
        return ResponseEntity.ok(updatedMemberRole);
    }

    // 회원 활성화 여부 수정
    @Operation(summary = "회원 활성화 여부 수정", description = "회원 활성화 여부 수정 수정 후 memberDto 반환")
    @Parameter(name = "id", description = "회원의 ID", required = true)
    @Parameter(name = "isActive", description = "회원 활성화/비활성화(y, n)", required = true)
    @PutMapping("/active")
    public ResponseEntity<MemberDto> updateMemberActive(@RequestBody MemberDto memberDto) {
        MemberDto updatedMemberActive = memberService.updateMemberActive(memberDto);
        return ResponseEntity.ok(updatedMemberActive);
    }


    @Operation(summary="회원(사용자) 상세조회", description = "회원(사용자) 고유번호 id 기준으로 조회")
    @GetMapping("/{id}")
    public ResponseEntity<MemberDto> getMemberById(@PathVariable Integer id) {
        MemberDto getMemberDetail = memberService.getMemberDetail(id);
        return ResponseEntity.ok(getMemberDetail);
    }



    @Operation(summary = "회원 정보 수정", description = "이름, 생년월일만 수정")
    // base 기준으로 이름, 생년월일만 수정하기때문에 PATCH 메서드로 변경
    @PatchMapping("/{id}")
    public ResponseEntity<MemberDto> updateMemberDetail(@PathVariable Integer id, @RequestBody MemberDto memberDto) {
        this.memberService.updateMemberDetail(id, memberDto);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @Operation(summary = "사용자 등록", description = "관리자만 가능하게끔 권한 체크할 예정")
    @PostMapping()
    public ResponseEntity<MemberDto> createMemberAdmin(@RequestBody MemberDto.Request memberDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getAuthorities().stream().noneMatch(
                a -> a.getAuthority().equals("admin"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        MemberDto createdMember = memberService.createMemberAdmin(memberDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMember);
    }
//
//    // 회원 삭제
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteMember(@PathVariable Integer id) {
//        memberService.deleteMember(id);
//        return ResponseEntity.noContent().build();
//    }
}