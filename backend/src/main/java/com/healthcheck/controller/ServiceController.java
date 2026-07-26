package com.healthcheck.controller;

import com.healthcheck.model.AlertRecipient;
import com.healthcheck.model.HealthService;
import com.healthcheck.repository.AlertRecipientRepository;
import com.healthcheck.service.AlertService;
import com.healthcheck.service.ServiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@Tag(name = "Services", description = "CRUD operations for managing monitored services")
@SecurityRequirement(name = "bearerAuth")
public class ServiceController {
    private final ServiceService serviceService;
    private final AlertService alertService;
    private final AlertRecipientRepository alertRecipientRepository;

    @GetMapping
    @Operation(summary = "Get all services", description = "Retrieves a list of all monitored services")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of services retrieved successfully")
    })
    public ResponseEntity<List<HealthService>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service by ID", description = "Retrieves a specific service by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Service found"),
        @ApiResponse(responseCode = "404", description = "Service not found")
    })
    public ResponseEntity<HealthService> getService(@Parameter(description = "Service ID", example = "1", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getService(id));
    }

    @PostMapping
    @Operation(summary = "Create a new service", description = "Creates a new monitored service with the provided configuration")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Service created successfully", content = @Content(schema = @Schema(implementation = HealthService.class))),
        @ApiResponse(responseCode = "400", description = "Invalid service data")
    })
    public ResponseEntity<HealthService> createService(@Parameter(description = "Service configuration", required = true) @RequestBody HealthService service) {
        return ResponseEntity.ok(serviceService.createService(service));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a service", description = "Updates an existing service configuration")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Service updated successfully", content = @Content(schema = @Schema(implementation = HealthService.class))),
        @ApiResponse(responseCode = "404", description = "Service not found")
    })
    public ResponseEntity<HealthService> updateService(@Parameter(description = "Service ID", example = "1", required = true) @PathVariable Long id, @Parameter(description = "Updated service configuration", required = true) @RequestBody HealthService service) {
        return ResponseEntity.ok(serviceService.updateService(id, service));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a service", description = "Deletes a service and all its associated data")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Service deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Service not found")
    })
    public ResponseEntity<Void> deleteService(@Parameter(description = "Service ID", example = "1", required = true) @PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/test-alert")
    @Operation(summary = "Test alert for a service", description = "Manually triggers an alert for a service to verify the alert system works without waiting for a real failure")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Alert triggered successfully", content = @Content(schema = @Schema(example = "{\"message\": \"Alert triggered for service: My Service\"}"))),
        @ApiResponse(responseCode = "404", description = "Service not found"),
        @ApiResponse(responseCode = "500", description = "Failed to trigger alert")
    })
    public ResponseEntity<Map<String, String>> testAlert(@Parameter(description = "Service ID", example = "1", required = true) @PathVariable Long id) {
        try {
            HealthService service = serviceService.getService(id);
            alertService.sendAlert(service);
            return ResponseEntity.ok(Map.of("message", "Alert triggered for service: " + service.getName()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reset-alert-cooldown")
    @Operation(summary = "Reset alert cooldown", description = "Resets the alert cooldown for a service. Useful for testing alert functionality")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Alert cooldown reset successfully", content = @Content(schema = @Schema(example = "{\"message\": \"Alert cooldown reset for service ID: 1\"}"))),
        @ApiResponse(responseCode = "500", description = "Failed to reset cooldown")
    })
    public ResponseEntity<Map<String, String>> resetAlertCooldown(@Parameter(description = "Service ID", example = "1", required = true) @PathVariable Long id) {
        try {
            alertService.resetAlertCooldown(id);
            return ResponseEntity.ok(Map.of("message", "Alert cooldown reset for service ID: " + id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/recipients")
    @Operation(summary = "Add alert recipient", description = "Adds an email recipient to receive alerts for a specific service")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Recipient added successfully", content = @Content(schema = @Schema(implementation = AlertRecipient.class))),
        @ApiResponse(responseCode = "400", description = "Invalid email or service not found")
    })
    public ResponseEntity<AlertRecipient> addRecipient(@Parameter(description = "Service ID", example = "1", required = true) @PathVariable Long id, @Parameter(description = "Email address", required = true) @RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        HealthService service = serviceService.getService(id);
        AlertRecipient recipient = new AlertRecipient();
        recipient.setService(service);
        recipient.setEmail(email);
        AlertRecipient saved = alertRecipientRepository.save(recipient);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}/recipients")
    @Operation(summary = "Get alert recipients", description = "Retrieves all email recipients configured to receive alerts for a service")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of recipients retrieved successfully")
    })
    public ResponseEntity<List<AlertRecipient>> getRecipients(@Parameter(description = "Service ID", example = "1", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(alertRecipientRepository.findByServiceId(id));
    }

    @DeleteMapping("/{serviceId}/recipients/{recipientId}")
    @Operation(summary = "Delete alert recipient", description = "Removes an email recipient from a service's alert list")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Recipient deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Recipient not found")
    })
    public ResponseEntity<Void> deleteRecipient(@Parameter(description = "Service ID", example = "1", required = true) @PathVariable Long serviceId, @Parameter(description = "Recipient ID", example = "1", required = true) @PathVariable Long recipientId) {
        alertRecipientRepository.deleteById(recipientId);
        return ResponseEntity.noContent().build();
    }
}