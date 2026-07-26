package com.healthcheck.repository;

import com.healthcheck.model.AlertRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRecipientRepository extends JpaRepository<AlertRecipient, Long> {
    List<AlertRecipient> findByServiceId(Long serviceId);
}