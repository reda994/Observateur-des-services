package com.healthcheck.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "services")
@Data
@Schema(description = "Health service entity representing monitored HTTP/HTTPS services")
public class HealthService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Service unique identifier", example = "1")
    private Long id;

    @Column(nullable = false)
    @Schema(description = "Service name", example = "Google API", required = true)
    private String name;

    @Schema(description = "Service description", example = "Main API endpoint for Google services")
    private String description;

    @Column(nullable = false)
    @Schema(description = "Service URL to monitor", example = "https://www.google.com", required = true)
    private String url;

    @Enumerated(EnumType.STRING)
    @Schema(description = "HTTP method for health check", example = "GET")
    private HttpMethod method = HttpMethod.GET;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "Custom HTTP headers (JSON format)", example = "{\"Authorization\": \"Bearer token\"}")
    private String headers;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "Request body for POST/PUT methods", example = "{\"key\": \"value\"}")
    private String body;

    @Schema(description = "Expected HTTP status codes (comma-separated)", example = "200,201,204")
    private String expectedStatusCodes = "200";

    @Schema(description = "Request timeout in seconds", example = "30")
    private Integer timeout = 30;
    
    @Schema(description = "Check frequency in seconds", example = "60")
    private Integer checkFrequency = 60;
    
    @Schema(description = "Latency threshold in milliseconds", example = "2000")
    private Integer latencyThreshold = 2000;
    
    @Schema(description = "Number of consecutive failures before marking as DOWN", example = "3")
    private Integer failureThreshold = 3;
    
    @Schema(description = "Optional keyword to search for in response body", example = "success")
    private String keyword;

    @Schema(description = "Whether email alerts are enabled", example = "true")
    private Boolean alertsEnabled = true;
    
    @Schema(description = "Whether service is in maintenance mode", example = "false")
    private Boolean maintenance = false;
    
    @Schema(description = "Whether service is active and being monitored", example = "true")
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Current service status", example = "UP")
    private Status currentStatus = Status.UP;

    @Schema(description = "Timestamp of last health check", example = "2024-01-15T10:30:00")
    private LocalDateTime lastCheckAt;
    
    @Schema(description = "Last response time in milliseconds", example = "150")
    private Long lastResponseTime;
    
    @Schema(description = "Uptime percentage", example = "99.5")
    private Double uptimePercentage = 100.0;
    
    @Schema(description = "Current consecutive failure count", example = "0")
    private Integer failureCount = 0;

    @Schema(description = "Service creation timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Service last update timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime updatedAt;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AlertRecipient> alertRecipients = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CheckResult> checkResults = new ArrayList<>();

    @Schema(description = "HTTP methods supported for health checks")
    public enum HttpMethod {
        @Schema(description = "GET method")
        GET, 
        @Schema(description = "POST method")
        POST, 
        @Schema(description = "HEAD method")
        HEAD, 
        @Schema(description = "PUT method")
        PUT, 
        @Schema(description = "DELETE method")
        DELETE
    }

    @Schema(description = "Service status values")
    public enum Status {
        @Schema(description = "Service is healthy and responding")
        UP, 
        @Schema(description = "Service is down or not responding")
        DOWN, 
        @Schema(description = "Service is responding but with degraded performance")
        DEGRADED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}