package com.healthcheck.service;

import com.healthcheck.model.CheckResult;
import com.healthcheck.model.HealthService;
import com.healthcheck.repository.CheckResultRepository;
import com.healthcheck.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {
    private final ServiceRepository serviceRepository;
    private final CheckResultRepository checkResultRepository;
    private final AlertService alertService;
    private final IncidentService incidentService;

    @Scheduled(fixedDelay = 5000)
    public void checkServices() {
        List<HealthService> services = serviceRepository.findByIsActiveTrueAndMaintenanceFalse();

        for (HealthService service : services) {
            LocalDateTime lastCheck = service.getLastCheckAt();
            if (lastCheck == null ||
                    lastCheck.plusSeconds(service.getCheckFrequency()).isBefore(LocalDateTime.now())) {
                checkService(service);
            }
        }
    }

    private void checkService(HealthService service) {
        try {
            long startTime = System.currentTimeMillis();
            HttpURLConnection connection = (HttpURLConnection) new URL(service.getUrl()).openConnection();
            connection.setRequestMethod(service.getMethod().name());
            connection.setConnectTimeout(service.getTimeout() * 1000);
            connection.setReadTimeout(service.getTimeout() * 1000);

            int responseCode = connection.getResponseCode();
            long responseTime = System.currentTimeMillis() - startTime;

            HealthService.Status status = validateResponse(service, responseCode, responseTime);

            // Sauvegarder le résultat
            CheckResult result = new CheckResult();
            result.setService(service);
            result.setStatus(status);
            result.setResponseTime(responseTime);
            result.setHttpStatus(responseCode);
            checkResultRepository.save(result);

            // Mettre à jour le service
            service.setLastCheckAt(LocalDateTime.now());
            service.setLastResponseTime(responseTime);

            HealthService.Status oldStatus = service.getCurrentStatus();

            if (status == HealthService.Status.UP) {
                service.setFailureCount(0);
                log.info("Service {} is UP, resetting failure count", service.getName());
                // Vérifier si l'incident est résolu
                incidentService.handleServiceRecovery(service.getId());
            } else {
                service.setFailureCount(service.getFailureCount() + 1);
                log.info("Service {} check failed. Failure count: {}/{}", 
                         service.getName(), service.getFailureCount(), service.getFailureThreshold());
                if (service.getFailureCount() >= service.getFailureThreshold()) {
                    log.warn("⚠️ Service {} reached failure threshold ({}). Setting status to DOWN", 
                             service.getName(), service.getFailureThreshold());
                    service.setCurrentStatus(HealthService.Status.DOWN);
                    incidentService.handleServiceIncident(service.getId(), "Service down: " + service.getName());
                    log.info("Alerts enabled for service {}: {}", service.getName(), service.getAlertsEnabled());
                    if (service.getAlertsEnabled()) {
                        log.info("📧 Calling alertService.sendAlert for service: {}", service.getName());
                        alertService.sendAlert(service);
                    } else {
                        log.warn("Alerts are disabled for service: {}", service.getName());
                    }
                }
            }

            serviceRepository.save(service);

        } catch (Exception e) {
            log.error("Error checking service {}: {}", service.getName(), e.getMessage(), e);
            service.setFailureCount(service.getFailureCount() + 1);
            service.setLastCheckAt(LocalDateTime.now());
            log.info("Service {} exception. Failure count: {}/{}", 
                     service.getName(), service.getFailureCount(), service.getFailureThreshold());

            if (service.getFailureCount() >= service.getFailureThreshold()) {
                log.warn("⚠️ Service {} reached failure threshold due to exception. Setting status to DOWN", 
                         service.getName());
                HealthService.Status oldStatus = service.getCurrentStatus();
                service.setCurrentStatus(HealthService.Status.DOWN);
                incidentService.handleServiceIncident(service.getId(), "Connection error: " + e.getMessage());
                log.info("Alerts enabled for service {}: {}", service.getName(), service.getAlertsEnabled());
                if (service.getAlertsEnabled()) {
                    log.info("📧 Calling alertService.sendAlert for service: {} (exception path)", service.getName());
                    alertService.sendAlert(service);
                } else {
                    log.warn("Alerts are disabled for service: {}", service.getName());
                }
            }
            serviceRepository.save(service);
        }
    }

    private HealthService.Status validateResponse(HealthService service, int responseCode, long responseTime) {
        // Vérifier le code HTTP
        String[] expectedCodes = service.getExpectedStatusCodes().split(",");
        boolean statusValid = false;
        for (String code : expectedCodes) {
            if (responseCode == Integer.parseInt(code.trim())) {
                statusValid = true;
                break;
            }
        }

        if (!statusValid) {
            return HealthService.Status.DOWN;
        }

        // Vérifier le temps de réponse
        if (service.getLatencyThreshold() != null && responseTime > service.getLatencyThreshold()) {
            return HealthService.Status.DEGRADED;
        }

        return HealthService.Status.UP;
    }
}