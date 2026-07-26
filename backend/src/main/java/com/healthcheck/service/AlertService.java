package com.healthcheck.service;

import com.healthcheck.model.AlertRecipient;
import com.healthcheck.model.HealthService;
import com.healthcheck.repository.AlertRecipientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {
    private final JavaMailSender mailSender;
    private final AlertRecipientRepository alertRecipientRepository;
    
    // Déduplication: mémorise le temps de la dernière alerte pour chaque service
    // Clé: serviceId, Valeur: timestamp de la dernière alerte
    private final Map<Long, LocalDateTime> lastAlertTimes = new ConcurrentHashMap<>();
    
    // Intervalle minimum entre deux alertes pour le même service (en minutes)
    private static final long ALERT_COOLDOWN_MINUTES = 30;

    public void sendAlert(HealthService service) {
        System.out.println("=== ALERT SERVICE CALLED ===");
        System.out.println("Service: " + service.getName());
        System.out.println("Service ID: " + service.getId());
        System.out.println("Alerts enabled: " + service.getAlertsEnabled());
        System.out.println("Current status: " + service.getCurrentStatus());
        System.out.println("Failure count: " + service.getFailureCount());
        
        log.info("=== sendAlert called for service: {} ===", service.getName());
        log.info("Service ID: {}", service.getId());
        log.info("Alerts enabled: {}", service.getAlertsEnabled());
        log.info("Current status: {}", service.getCurrentStatus());
        log.info("Failure count: {}", service.getFailureCount());

        if (!service.getAlertsEnabled()) {
            System.out.println("ALERTS DISABLED - RETURNING");
            log.warn("Alerts are disabled for service: {}", service.getName());
            return;
        }

        // Vérifier la déduplication (cooldown)
        LocalDateTime lastAlertTime = lastAlertTimes.get(service.getId());
        if (lastAlertTime != null) {
            LocalDateTime cooldownEnd = lastAlertTime.plusMinutes(ALERT_COOLDOWN_MINUTES);
            if (LocalDateTime.now().isBefore(cooldownEnd)) {
                System.out.println("COOLDOWN ACTIVE - RETURNING");
                log.warn("⏸️ Alert cooldown active for service {}. Last alert sent at {}. Next alert allowed after {}", 
                         service.getName(), lastAlertTime, cooldownEnd);
                return;
            }
        }

        List<AlertRecipient> recipients = alertRecipientRepository.findByServiceId(service.getId());
        System.out.println("RECIPIENTS FOUND: " + recipients.size());
        if (!recipients.isEmpty()) {
            System.out.println("FIRST RECIPIENT EMAIL: " + recipients.get(0).getEmail());
        }
        log.info("Found {} alert recipients for service: {}", recipients.size(), service.getName());

        if (recipients.isEmpty()) {
            System.out.println("NO RECIPIENTS - RETURNING");
            log.warn("No alert recipients for service: {}", service.getName());
            return;
        }

        String subject = "🔴 ALERT: " + service.getName() + " is DOWN!";
        String body = buildAlertMessage(service);

        boolean allSent = true;
        for (AlertRecipient recipient : recipients) {
            try {
                System.out.println("SENDING EMAIL TO: " + recipient.getEmail());
                log.info("Attempting to send email to: {}", recipient.getEmail());
                sendEmail(recipient.getEmail(), subject, body);
                System.out.println("EMAIL SENT SUCCESSFULLY TO: " + recipient.getEmail());
                log.info("✅ Alert sent successfully to {}", recipient.getEmail());
            } catch (Exception e) {
                System.out.println("EMAIL FAILED TO: " + recipient.getEmail() + " - " + e.getMessage());
                log.error("❌ Failed to send alert to {}: {}", recipient.getEmail(), e.getMessage(), e);
                allSent = false;
            }
        }

        // Enregistrer le temps de la dernière alerte seulement si au moins un envoi a réussi
        if (allSent) {
            lastAlertTimes.put(service.getId(), LocalDateTime.now());
            System.out.println("RECORDED ALERT TIME FOR: " + service.getName());
            log.info("📝 Recorded last alert time for service: {}", service.getName());
        }
    }

    public void sendTestEmail(String to) {
        log.info("=== Sending test email to: {} ===", to);
        try {
            String subject = "🧪 TEST EMAIL - HealthCheck Monitor";
            String body = "This is a test email from HealthCheck Monitor.\n\n" +
                         "If you receive this, SMTP configuration is working correctly.\n\n" +
                         "Time: " + LocalDateTime.now();
            sendEmail(to, subject, body);
            log.info("✅ Test email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("❌ Failed to send test email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send test email: " + e.getMessage(), e);
        }
    }

    /**
     * Réinitialise le cooldown pour un service spécifique (utile pour les tests)
     */
    public void resetAlertCooldown(Long serviceId) {
        lastAlertTimes.remove(serviceId);
        log.info("Reset alert cooldown for service ID: {}", serviceId);
    }

    private String buildAlertMessage(HealthService service) {
        StringBuilder sb = new StringBuilder();
        sb.append("HealthCheck Monitor Alert\n");
        sb.append("==========================\n\n");
        sb.append("Service: ").append(service.getName()).append("\n");
        sb.append("URL: ").append(service.getUrl()).append("\n");
        sb.append("Status: ").append(service.getCurrentStatus()).append("\n");
        sb.append("Failure Count: ").append(service.getFailureCount()).append("\n");
        sb.append("Time: ").append(LocalDateTime.now()).append("\n\n");
        sb.append("Please check the service immediately.\n");
        sb.append("Dashboard: http://localhost:8080");
        return sb.toString();
    }

    private void sendEmail(String to, String subject, String body) {
        log.debug("Creating email message - To: {}, Subject: {}", to, subject);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        log.debug("Sending email via JavaMailSender...");
        mailSender.send(message);
        log.debug("Email sent successfully");
    }
}