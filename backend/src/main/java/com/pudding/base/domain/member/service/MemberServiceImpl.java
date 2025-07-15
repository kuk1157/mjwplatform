package com.pudding.base.domain.member.service;

import com.pudding.base.domain.common.enums.IsActive;
import com.pudding.base.domain.common.exception.EmailSendException;
import com.pudding.base.domain.email_verify.enums.IsVerify;
import com.pudding.base.domain.email_verify.exception.EmailVerifyException;
import com.pudding.base.domain.member.dto.MemberDto;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.exception.MemberInvalidPasswordException;
import com.pudding.base.domain.member.exception.MemberNotFoundException;
import com.pudding.base.domain.member.exception.MemberValidateException;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.member.validator.MemberValidator;
import com.pudding.base.security.JwtUtil;
import com.pudding.base.util.MailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pudding.base.domain.email_verify.repository.EmailVerifyRepository;
import com.pudding.base.domain.email_verify.entity.EmailVerify;
import com.pudding.base.domain.member.enums.Role;


import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final EmailVerifyRepository emailVerifyRepository;
    private final JwtUtil jwtTokenProvider;
    private final BCryptPasswordEncoder encoder;
    private final MemberValidator memberValidator;
    private final MailUtils mailUtils;

    // 회원 등록
    @Transactional
    @Override
    public MemberDto createMember(MemberDto.Request memberDto) {
        memberValidator.validate(memberDto);
        Member existingMember = memberRepository.findByLoginIdAndIsActive(memberDto.getLoginId(), IsActive.y);
        if(existingMember != null) {
            throw new MemberValidateException("이미 사용 중인 로그인 아이디입니다. " + memberDto.getLoginId());
        }
        Member MemberEmail = memberRepository.findByEmailAndIsActive(memberDto.getEmail(), IsActive.y);
        if(MemberEmail != null) {
            throw new MemberValidateException("이미 사용 중인 이메일 입니다. " + memberDto.getEmail());
        }
        String encodedPassword = encoder.encode(memberDto.getPassword());

        Member member = memberDto.toEntity();

        Member memberToSave = member.toBuilder()
                .password(encodedPassword)
                .build();

        // 엔티티 저장
        Member savedMember = memberRepository.save(memberToSave);

        // 저장된 엔티티를 DTO로 변환해서 반환
        return MemberDto.fromEntity(savedMember);
    }

    // 아이디 중복 체크
    @Transactional(readOnly = true)
    @Override
    public boolean checkLoginId(String loginId) {
        Member existingMember = memberRepository.findByLoginIdAndIsActive(loginId, IsActive.y);
        if(existingMember != null) {
            return false;
        }

        return true;
    }

    // 회원 정보 조회
    @Transactional(readOnly = true)
    @Override
    public MemberDto findById(Integer id) {
        // ID로 회원 조회
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("회원이 존재하지 않습니다."));

        // 조회된 엔티티를 DTO로 변환해서 반환
        return MemberDto.fromEntity(member);
    }

    // 전체 회원 조회
    @Transactional(readOnly = true)
    @Override
    public Page<MemberDto> findMembers(Pageable pageable, String keyword, String name, String loginId) {
        // 모든 회원 조회 후 엔티티 리스트를 DTO 리스트로 변환
        return memberRepository.findMembers(pageable, keyword, name, loginId)
                .map(MemberDto::fromEntity); // 엔티티를 DTO로 변환
    }



    // 관리자 전용 사용자 등록
    @Override
    @Transactional
    public MemberDto createMemberAdmin(MemberDto.Request request) {

        // 임시로 1234로 자동설정
        String rawPassword = "1234";
        String encodedPassword = encoder.encode(rawPassword);

        Member newMember = Member.builder()
                .loginId(request.getLoginId())
                .password(encodedPassword)
                .name(request.getName())
                .birthday(request.getBirthday())
                .role(request.getRole() != null ? request.getRole() : Role.user) // 기본값 user
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .isActive(com.pudding.base.domain.common.enums.IsActive.y)
                .build();

        Member saved = memberRepository.save(newMember);
        return MemberDto.fromEntity(saved);
    }


    // 이메일 중복 체크
    @Transactional(readOnly = true)
    @Override
    public boolean checkEmail(String email) {
        Member existingMember = memberRepository.findByEmailAndIsActive(email, IsActive.y);
        if(existingMember != null) {
            return false;
        }
        return true;
    }

    // 회원(사용자) 상세조회
    @Override
    public MemberDto getMemberDetail(Integer id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다."));
        return MemberDto.fromEntity(member);
    }

    // 회원(사용자) 정보 수정 - PATCH(이름, 생년월일만 수정)
    @Transactional
    @Override
    public MemberDto updateMemberDetail(Integer id, MemberDto memberDto) {
        // 기존 회원 조회
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("해당 사용자가 존재하지 않습니다."));

        if (memberDto.getName() != null) member.updateName(memberDto.getName()); // 이름 예외처리
        if (memberDto.getBirthday() != null) member.updateBirthday(memberDto.getBirthday()); // 생년월일 예외처리
        return MemberDto.fromEntity(member);
    }

    // 회원 권한 수정
    @Transactional
    @Override
    public MemberDto updateMemberRole(MemberDto memberDto) {
        // 기존 회원 조회
        Member member = memberRepository.findById(memberDto.getId())
                .orElseThrow(() -> new MemberNotFoundException("회원이 존재하지 않습니다."));

        // 회원 정보 수정
        member.updateRole(memberDto.getRole());

        memberRepository.save(member);

        // 수정된 회원 저장 후 DTO로 변환하여 반환
        return MemberDto.fromEntity(member);
    }

    // 회원 활성화 여부 수정
    @Transactional
    @Override
    public MemberDto updateMemberActive(MemberDto memberDto) {
        // 기존 회원 조회
        Member member = memberRepository.findById(memberDto.getId())
                .orElseThrow(() -> new MemberNotFoundException("회원이 존재하지 않습니다."));

        // 회원 정보 수정
        member.updateIsActive(memberDto.getIsActive());

        memberRepository.save(member);

        // 수정된 회원 저장 후 DTO로 변환하여 반환
        return MemberDto.fromEntity(member);
    }

    // 회원 정보 수정
    @Transactional
    @Override
    public MemberDto updateMember(String accessToken, MemberDto memberDto) {
        Integer id = this.jwtTokenProvider.getUserId(accessToken.substring(7));

        // 기존 회원 조회
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("회원이 존재하지 않습니다."));

        // 회원 정보 수정
        member.updateName(memberDto.getName());
        member.updateGender(memberDto.getGender());
        member.updateBirthday(memberDto.getBirthday());
        member.updateEmail(memberDto.getEmail());
        member.updatePhoneNumber(memberDto.getPhoneNumber());

        memberRepository.save(member);

        // 수정된 회원 저장 후 DTO로 변환하여 반환
        return MemberDto.fromEntity(member);
    }

    // 아이디 찾기
    @Transactional
    @Override
    public void findLoginId(MemberDto memberDto) {
        String email = memberDto.getEmail();

        Member member = memberRepository.findByEmailAndIsActive(email, IsActive.y);
        if(member != null) {
            String subject = "DACARE 아이디 찾기";
            String text =
                    "<html>" +
                            "<body>" +
                            "<h2>DACARE 아이디 찾기</h2>" +
                            "<br>" +
                            "<p>회원님의 아이디를 보내드려요.</p>" +
                            "<br>" +
                            "<h2>" + member.getLoginId() + "</h2>" +
                            "</body>" +
                            "</html>";

            if (!mailUtils.sendEmail(email, subject, text)) {
                throw new EmailSendException("이메일 전송에 실패 했습니다.");
            }
        }
    }

    // 비밀번호 찾기 재설정
    @Transactional
    @Override
    public void updateFindPassword(MemberDto.FindPasswordRequest memberDto) {
        Member member = memberRepository.findByLoginIdAndIsActive(memberDto.getLoginId(), IsActive.y);
        if(member == null) {
            throw new MemberNotFoundException("회원이 존재하지 않습니다.");
        }
        EmailVerify emailVerify = emailVerifyRepository.findTopByEmailOrderByCreatedAtDesc(member.getEmail())
                .orElseThrow(() -> new EmailVerifyException("이메일에 일치하는 인증번호가 존재하지 않습니다.", "1001"));

        if(!member.getEmail().equals(emailVerify.getEmail())) {
            throw new EmailVerifyException("회원 이메일 정보와 일치하지 않습니다.", "2001");
        }

        LocalDateTime now = LocalDateTime.now();
        long minutesElapsed = ChronoUnit.MINUTES.between(emailVerify.getCreatedAt(), now);
        if (minutesElapsed > 10) {
            throw new EmailVerifyException("유효시간이 초과되었습니다.", "1003");
        }

        if(IsVerify.n.equals(emailVerify.getIsVerify())) {
            throw new EmailVerifyException("인증되지 않은 이메일 입니다.", "1006");
        }

//        String characters = "abcdefghijklmnopqrstuvwxyz0123456789";
//        Random random = new Random();
//        StringBuilder password = new StringBuilder(8);
//
//        for (int i = 0; i < 8; i++) {
//            password.append(characters.charAt(random.nextInt(characters.length())));
//        }
        String encodedPassword = encoder.encode(memberDto.getPassword());
//        String encodedPassword = encoder.encode(password.toString());
//
//        String email = member.getEmail();
//        String subject = "DACARE 비밀번호 찾기";
//        String text =
//                "<html>" +
//                        "<body>" +
//                        "<h2>DACARE 임시 비밀번호 발급</h2>" +
//                        "<br>" +
//                        "<p>회원님의 임시 비밀번호를 보내드려요.</p>" +
//                        "<br>" +
//                        "<h2>" + password + "</h2>" +
//                        "</body>" +
//                        "</html>";
//
//        if (!mailUtils.sendEmail(email, subject, text)) {
//            throw new EmailSendException("이메일 전송에 실패 했습니다.");
//        }

        member.updatePassword(encodedPassword);

        memberRepository.save(member);
    }

    // 비밀번호 변경
    @Transactional
    @Override
    public void updatePassword(String accessToken, MemberDto.PasswordRequest memberDto) {
        Integer id = this.jwtTokenProvider.getUserId(accessToken.substring(7));
        String encodedPassword = memberDto.getPassword();
        String encodedNewPassword = encoder.encode(memberDto.getNewPassword());

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("회원이 존재하지 않습니다."));

        if (!encoder.matches(encodedPassword, member.getPassword())) {
            throw new MemberInvalidPasswordException("비밀번호가 틀립니다.");
        }

        member.updatePassword(encodedNewPassword);

        memberRepository.save(member);
    }

    // 회원탈퇴
    @Transactional
    @Override
    public void deleteMember(String accessToken) {
        Integer id = this.jwtTokenProvider.getUserId(accessToken.substring(7));
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("회원이 존재하지 않습니다."));
        member.updateIsActive(IsActive.n);

        memberRepository.save(member);
    }
}