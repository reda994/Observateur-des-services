package com.healthcheck.repository;

import com.healthcheck.model.CheckResult;
import com.healthcheck.model.HealthService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CheckResultRepository extends JpaRepository<CheckResult, Long> {
    List<CheckResult> findByServiceIdOrderByCheckedAtDesc(Long serviceId);
    Long countByServiceIdAndStatusAndCheckedAtAfter(Long serviceId, HealthService.Status status, LocalDateTime date);
}