package com.healthcheck.service;

import com.healthcheck.model.HealthService;
import com.healthcheck.repository.CheckResultRepository;
import com.healthcheck.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ServiceRepository serviceRepository;
    private final CheckResultRepository checkResultRepository;

    public DashboardStatistics getDashboardStatistics() {
                List<HealthService> services = serviceRepository.findAll();

        long total = services.size();
                long up = services.stream().filter(s -> s.getCurrentStatus() == HealthService.Status.UP).count();
                long down = services.stream().filter(s -> s.getCurrentStatus() == HealthService.Status.DOWN).count();
                long degraded = services.stream().filter(s -> s.getCurrentStatus() == HealthService.Status.DEGRADED).count();
                long maintenance = services.stream().filter(HealthService::getMaintenance).count();

        double avgResponseTime = services.stream()
                .filter(s -> s.getLastResponseTime() != null)
                .mapToLong(HealthService::getLastResponseTime)
                .average()
                .orElse(0.0);

        Double globalUptime = services.stream()
                .filter(s -> s.getUptimePercentage() != null)
                .mapToDouble(HealthService::getUptimePercentage)
                .average()
                .orElse(100.0);

        List<DashboardStatistics.ServiceStatus> serviceStatuses = services.stream()
                .map(s -> new DashboardStatistics.ServiceStatus(
                        s.getId(),
                        s.getName(),
                        s.getUrl(),
                        s.getCurrentStatus().name(),
                        s.getLastResponseTime(),
                        s.getLastCheckAt() != null ? s.getLastCheckAt().toString() : null,
                        s.getUptimePercentage()
                ))
                .collect(Collectors.toList());

        return new DashboardStatistics(
                total, up, down, degraded, maintenance,
                avgResponseTime, globalUptime, serviceStatuses
        );
    }

    public Map<String, Object> getStatistics(String period) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("uptime", List.of(99.9, 99.8, 99.7, 99.9, 99.5));
        stats.put("responseTimes", List.of(120, 150, 90, 200, 80));
        stats.put("incidents", List.of(0, 1, 0, 2, 0));
        return stats;
    }
}