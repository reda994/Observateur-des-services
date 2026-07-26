package com.healthcheck.scheduler;

import com.healthcheck.service.SchedulerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class HealthCheckScheduler {

    private final SchedulerService schedulerService;

    /**
     * Exécute les vérifications de santé de tous les services actifs.
     * La tâche est programmée pour s'exécuter toutes les 5 secondes.
     * Le mécanisme interne de SchedulerService gère la fréquence de chaque service.
     */
    @Scheduled(fixedDelay = 5000)
    public void runHealthChecks() {
        log.debug("Exécution du scheduler de vérification des services...");
        schedulerService.checkServices();
    }
}