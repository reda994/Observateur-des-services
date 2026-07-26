package com.healthcheck;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HealthCheckApplication {
    public static void main(String[] args) {
        SpringApplication.run(HealthCheckApplication.class, args);
        System.out.println("========================================");
        System.out.println("✅ HealthCheck Monitor démarré !");
        System.out.println("📊 Dashboard: http://localhost:8080");
        System.out.println("📚 Swagger: http://localhost:8080/api-docs");
        System.out.println("========================================");
    }
}