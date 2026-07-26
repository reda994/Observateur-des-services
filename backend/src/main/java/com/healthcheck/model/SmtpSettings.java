package com.healthcheck.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "smtp_settings")
@Data
public class SmtpSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String host;
    private Integer port = 587;
    private String username;
    private String password;
    private Boolean tls = true;
    private Boolean ssl = false;
    private String fromEmail;
}