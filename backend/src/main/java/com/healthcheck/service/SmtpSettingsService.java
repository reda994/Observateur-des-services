package com.healthcheck.service;

import com.healthcheck.model.SmtpSettings;
import com.healthcheck.repository.SmtpSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
@RequiredArgsConstructor
public class SmtpSettingsService {
    private final SmtpSettingsRepository smtpSettingsRepository;

    public SmtpSettings getSettings() {
        return smtpSettingsRepository.findTopByOrderByIdAsc().orElse(new SmtpSettings());
    }

    public SmtpSettings updateSettings(SmtpSettings settings) {
        SmtpSettings existing = getSettings();
        existing.setHost(settings.getHost());
        existing.setPort(settings.getPort());
        existing.setUsername(settings.getUsername());
        existing.setPassword(settings.getPassword());
        existing.setTls(settings.getTls());
        existing.setSsl(settings.getSsl());
        existing.setFromEmail(settings.getFromEmail());
        return smtpSettingsRepository.save(existing);
    }

    public boolean testConnection(SmtpSettings settings) {
        try {
            createMailSender(settings);
            return true;
        } catch (Exception e) { return false; }
    }

    private JavaMailSender createMailSender(SmtpSettings settings) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(settings.getHost());
        sender.setPort(settings.getPort());
        sender.setUsername(settings.getUsername());
        sender.setPassword(settings.getPassword());
        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        if (settings.getTls()) props.put("mail.smtp.starttls.enable", "true");
        if (settings.getSsl()) props.put("mail.smtp.ssl.enable", "true");
        return sender;
    }
}