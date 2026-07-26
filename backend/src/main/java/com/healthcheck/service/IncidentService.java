package com.healthcheck.service;

import com.healthcheck.model.Incident;
import com.healthcheck.model.HealthService;
import com.healthcheck.repository.IncidentRepository;
import com.healthcheck.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class IncidentService {
    private final IncidentRepository incidentRepository;
    private final ServiceRepository serviceRepository;

    public void handleServiceIncident(Long serviceId, String reason) {
        HealthService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Incident incident = new Incident();
        incident.setService(service);
        incident.setReason(reason);
        incidentRepository.save(incident);
    }

    public void handleServiceRecovery(Long serviceId) {
        incidentRepository.findByServiceIdAndEndedAtIsNull(serviceId)
                .ifPresent(incident -> {
                    incident.setEndedAt(LocalDateTime.now());
                    incident.setDuration(Duration.between(
                            incident.getStartedAt(),
                            incident.getEndedAt()
                    ).getSeconds());
                    incidentRepository.save(incident);
                });
    }
}