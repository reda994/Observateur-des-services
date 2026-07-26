package com.healthcheck.repository;

import com.healthcheck.model.HealthService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
 public interface ServiceRepository extends JpaRepository<HealthService, Long> {
     List<HealthService> findByIsActiveTrue();
     List<HealthService> findByCurrentStatusAndIsActiveTrue(HealthService.Status status);
     List<HealthService> findByIsActiveTrueAndMaintenanceFalse();
}