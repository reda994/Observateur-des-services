package com.healthcheck.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "check_results")
@Data
public class CheckResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private HealthService service;

    @Enumerated(EnumType.STRING)
    private HealthService.Status status;

    private Long responseTime;
    private Integer httpStatus;
    private String errorMessage;
    private LocalDateTime checkedAt;

    @PrePersist
    protected void onCreate() {
        checkedAt = LocalDateTime.now();
    }
}