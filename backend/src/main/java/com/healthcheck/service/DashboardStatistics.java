package com.healthcheck.service;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dashboard statistics containing service counts and performance metrics")
public class DashboardStatistics {
    @Schema(description = "Total number of services", example = "10")
    private Long totalServices;
    
    @Schema(description = "Number of services with UP status", example = "8")
    private Long upServices;
    
    @Schema(description = "Number of services with DOWN status", example = "1")
    private Long downServices;
    
    @Schema(description = "Number of services with DEGRADED status", example = "1")
    private Long degradedServices;
    
    @Schema(description = "Number of services in maintenance mode", example = "0")
    private Long maintenanceServices;
    
    @Schema(description = "Average response time across all services in milliseconds", example = "150.5")
    private Double averageResponseTime;
    
    @Schema(description = "Global uptime percentage across all services", example = "99.5")
    private Double globalUptime;
    
    @Schema(description = "List of individual service statuses")
    private List<ServiceStatus> serviceStatuses;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Individual service status information")
    public static class ServiceStatus {
        @Schema(description = "Service ID", example = "1")
        private Long id;
        
        @Schema(description = "Service name", example = "Google API")
        private String name;
        
        @Schema(description = "Service URL", example = "https://www.google.com")
        private String url;
        
        @Schema(description = "Current service status (UP, DOWN, DEGRADED)", example = "UP")
        private String status;
        
        @Schema(description = "Last response time in milliseconds", example = "150")
        private Long responseTime;
        
        @Schema(description = "Timestamp of last health check", example = "2024-01-15T10:30:00")
        private String lastCheck;
        
        @Schema(description = "Service uptime percentage", example = "99.5")
        private Double uptimePercentage;
    }
}