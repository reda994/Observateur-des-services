package com.healthcheck.service;

import com.healthcheck.model.HealthService;
import com.healthcheck.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {
    private final ServiceRepository serviceRepository;

    public List<HealthService> getAllServices() {
        return serviceRepository.findAll();
    }

    public HealthService getService(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public HealthService createService(HealthService service) {
        return serviceRepository.save(service);
    }

    public HealthService updateService(Long id, HealthService serviceDetails) {
        HealthService service = getService(id);
        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
        service.setUrl(serviceDetails.getUrl());
        service.setMethod(serviceDetails.getMethod());
        service.setHeaders(serviceDetails.getHeaders());
        service.setBody(serviceDetails.getBody());
        service.setExpectedStatusCodes(serviceDetails.getExpectedStatusCodes());
        service.setTimeout(serviceDetails.getTimeout());
        service.setCheckFrequency(serviceDetails.getCheckFrequency());
        service.setLatencyThreshold(serviceDetails.getLatencyThreshold());
        service.setFailureThreshold(serviceDetails.getFailureThreshold());
        service.setKeyword(serviceDetails.getKeyword());
        service.setAlertsEnabled(serviceDetails.getAlertsEnabled());
        service.setMaintenance(serviceDetails.getMaintenance());
        service.setIsActive(serviceDetails.getIsActive());
        return serviceRepository.save(service);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}