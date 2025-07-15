package com.pudding.base.domain.member.service;

import com.pudding.base.domain.member.dto.MemberDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface MemberService {
    MemberDto createMember(MemberDto.Request memberDto);
    MemberDto findById(Integer id);
    boolean checkLoginId(String loginId);
    MemberDto updateMember(String accessToken, MemberDto memberDto);
    void findLoginId(MemberDto memberDto);
    void updateFindPassword(MemberDto.FindPasswordRequest memberDto);
    void updatePassword(String accessToken, MemberDto.PasswordRequest memberDto);
    void deleteMember(String accessToken);

    MemberDto updateMemberActive(MemberDto memberDto);


    boolean checkEmail(String email); // 이메일 중복 확인(사용자관리에서 임시로 사용할 기능)
    MemberDto updateMemberDetail(Integer id, MemberDto memberDto); // 회원(사용자) 정보 수정(고유번호 기준
    MemberDto getMemberDetail(Integer id); // 회원(사용자) 상세 조회
    MemberDto createMemberAdmin(MemberDto.Request memberDto); // 관리자일때 사용자 다이렉트 등록기능


    Page<MemberDto> findMembers(Pageable pageable, String keyword, String name, String loginId);
    MemberDto updateMemberRole(MemberDto memberDto);
}