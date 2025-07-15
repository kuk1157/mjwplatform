package com.pudding.base.domain.email_verify.service;

import com.pudding.base.domain.common.exception.EmailSendException;
import com.pudding.base.domain.email_verify.dto.EmailVerifyDto;
import com.pudding.base.domain.email_verify.entity.EmailVerify;
import com.pudding.base.domain.email_verify.enums.IsVerify;
import com.pudding.base.domain.email_verify.exception.EmailVerifyException;
import com.pudding.base.domain.email_verify.repository.EmailVerifyRepository;
import com.pudding.base.util.MailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailVerifyServiceImpl implements EmailVerifyService {
    private final MailUtils mailUtils;
    private final EmailVerifyRepository emailVerifyRepository;

    @Transactional
    @Override
    public void sendEmail(EmailVerifyDto.Request emailVerifyDto) {
        String email = emailVerifyDto.getEmail();
        Random random = new Random();
        String code = String.format("%06d", random.nextInt(900000) + 1);

        EmailVerify emailVerifyToSave = EmailVerify.builder()
                .email(email)
                .number(code)
                .build();

        emailVerifyRepository.save(emailVerifyToSave);

        String subject = "DACARE 인증번호 발송";
        String text =
                "<html>" +
                    "<body>" +
                    "<h2>DACARE 본인인증 코드</h2>" +
                    "<br>" +
                    "<p>DACARE 본인인증을 위한 코드를 보내드려요.</p>" +
                    "<p>아래의 인증번호를 입력하고 인증을 완료해주세요.</p>" +
                    "<br>" +
                    "<h2>" + code + "</h2>" +
                    "</body>" +
                "</html>";

        if (!mailUtils.sendEmail(email, subject, text)) {
            throw new EmailSendException("이메일 전송에 실패 했습니다.");
        }
    }

    @Transactional
    @Override
    public ResponseEntity<?> verifyEmail(EmailVerifyDto.Request emailVerifyDto) {
        EmailVerify emailVerify = emailVerifyRepository.findTopByEmailOrderByCreatedAtDesc(emailVerifyDto.getEmail())
            .orElseThrow(() -> new EmailVerifyException("이메일에 일치하는 인증번호가 존재하지 않습니다.", "1001"));

        LocalDateTime createdAt = emailVerify.getCreatedAt();
        LocalDateTime now = LocalDateTime.now();

        if (IsVerify.y.equals(emailVerify.getIsVerify())) {
            throw new EmailVerifyException("이미 만료된 요청입니다.", "1002");
        }

        if (Duration.between(createdAt, now).toMinutes() > 3) {
            throw new EmailVerifyException("유효시간이 초과되었습니다.", "1003");
        }

        if (!emailVerify.getNumber().equals(emailVerifyDto.getNumber())) {
            throw new EmailVerifyException("인증번호가 일치하지 않습니다.", "1004");
        }

        emailVerify.updateIsVerify(IsVerify.y);
        emailVerifyRepository.save(emailVerify);

        return ResponseEntity.ok("이메일 인증 성공");
    }
}
