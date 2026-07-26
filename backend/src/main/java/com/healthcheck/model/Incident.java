package com.healthcheck.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
@Data
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private HealthService service;

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Long duration;
    private String reason;

    @PrePersist
    protected void onCreate() {
        startedAt = LocalDateTime.now();
    }
}