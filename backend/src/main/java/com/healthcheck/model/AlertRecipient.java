package com.healthcheck.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "alert_recipients")
@Data
@Schema(description = "Alert recipient entity representing email addresses for service alerts")
public class AlertRecipient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Alert recipient unique identifier", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "service_id")
    @Schema(description = "Associated health service")
    private HealthService service;

    @Column(nullable = false)
    @Schema(description = "Email address to receive alerts", example = "user@example.com", required = true)
    private String email;
}