package com.example.linkhubbackend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    /**
     * Sends the email-verification email asynchronously so registration is instant.
     */
    @Async
    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        try {
            String verificationUrl = frontendUrl + "/verify-email?token=" + token;

            Context ctx = new Context();
            ctx.setVariable("name", fullName);
            ctx.setVariable("email", toEmail);
            ctx.setVariable("verificationUrl", verificationUrl);

            String htmlBody = templateEngine.process("email-verification", ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "LinkHub");
            helper.setTo(toEmail);
            helper.setSubject("✅ Verify your LinkHub email address");
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("✅ Verification email successfully sent to {}", toEmail);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("❌ MessagingException sending verification email to {}: {}", toEmail, e.getMessage(), e);
        } catch (MailException e) {
            log.error("❌ MailException sending verification email to {}: {}", toEmail, e.getMessage(), e);
        } catch (Exception e) {
            log.error("❌ Unexpected error sending verification email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    /**
     * Sends the password-reset email asynchronously.
     */
    @Async
    public void sendPasswordResetEmail(String toEmail, String fullName, String token) {
        try {
            String resetUrl = frontendUrl + "/reset-password?token=" + token;

            Context ctx = new Context();
            ctx.setVariable("name", fullName);
            ctx.setVariable("email", toEmail);
            ctx.setVariable("resetUrl", resetUrl);

            String htmlBody = templateEngine.process("password-reset", ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "LinkHub");
            helper.setTo(toEmail);
            helper.setSubject("🔑 Reset your LinkHub password");
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("✅ Password reset email successfully sent to {}", toEmail);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("❌ MessagingException sending password reset email to {}: {}", toEmail, e.getMessage(), e);
        } catch (MailException e) {
            log.error("❌ MailException sending password reset email to {}: {}", toEmail, e.getMessage(), e);
        } catch (Exception e) {
            log.error("❌ Unexpected error sending password reset email to {}: {}", toEmail, e.getMessage(), e);
        }
    }
}
