package com.pudding.base.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class MailUtils {

    @Autowired
    private JavaMailSender javaMailSender;

    /**
     * 이메일을 전송하는 메서드
     * @param to 수신자 이메일 주소
     * @param subject 이메일 제목
     * @param text 이메일 본문 (HTML 형식으로 보내기 위해 'true' 설정)
     */
    public boolean sendEmail(String to, String subject, String text) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);

            javaMailSender.send(mimeMessage);

            return true;
        } catch (MessagingException e) {
            System.out.println("Email Error: " + e.getMessage());
            return false;
        }
    }
}