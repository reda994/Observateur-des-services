package com.healthcheck.controller;

import com.healthcheck.model.SmtpSettings;
import com.healthcheck.service.AlertService;
import com.healthcheck.service.SmtpSettingsService;
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

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Tag(name = "Settings", description = "Endpoints for managing SMTP settings and email configuration")
@SecurityRequirement(name = "bearerAuth")
public class SettingsController {

    private final SmtpSettingsService smtpSettingsService;
    private final AlertService alertService;

    @GetMapping("/smtp")
    @Operation(summary = "Get SMTP settings", description = "Retrieves the current SMTP configuration for email alerts")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "SMTP settings retrieved successfully", content = @Content(schema = @Schema(implementation = SmtpSettings.class)))
    })
    public ResponseEntity<SmtpSettings> getSmtpSettings() {
        return ResponseEntity.ok(smtpSettingsService.getSettings());
    }

    @PutMapping("/smtp")
    @Operation(summary = "Update SMTP settings", description = "Updates the SMTP configuration for email alerts")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "SMTP settings updated successfully", content = @Content(schema = @Schema(implementation = SmtpSettings.class))),
        @ApiResponse(responseCode = "400", description = "Invalid SMTP settings")
    })
    public ResponseEntity<SmtpSettings> updateSmtpSettings(@Parameter(description = "Updated SMTP settings", required = true) @RequestBody SmtpSettings settings) {
        return ResponseEntity.ok(smtpSettingsService.updateSettings(settings));
    }

    @PostMapping("/smtp/test")
    @Operation(summary = "Test SMTP connection", description = "Tests the SMTP connection with provided settings or saved settings if none provided")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Connection test completed", content = @Content(schema = @Schema(example = "{\"success\": true}")))
    })
    public ResponseEntity<Map<String, Boolean>> testSmtpConnection(@Parameter(description = "SMTP settings to test (optional - uses saved settings if not provided)") @RequestBody(required = false) SmtpSettings settings) {
        boolean success;
        if (settings != null) {
            success = smtpSettingsService.testConnection(settings);
        } else {
            success = smtpSettingsService.testConnection(smtpSettingsService.getSettings());
        }
        return ResponseEntity.ok(Map.of("success", success));
    }

    @PostMapping("/smtp/test-email")
    @Operation(summary = "Send test email", description = "Sends a test email to verify email sending functionality")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Test email sent successfully", content = @Content(schema = @Schema(example = "{\"message\": \"Test email sent to user@example.com\"}"))),
        @ApiResponse(responseCode = "400", description = "Invalid email address", content = @Content(schema = @Schema(example = "{\"error\": \"Email address 'to' is required\"}"))),
        @ApiResponse(responseCode = "500", description = "Failed to send email")
    })
    public ResponseEntity<Map<String, String>> sendTestEmail(@Parameter(description = "Email address to send test to", required = true) @RequestBody Map<String, String> request) {
        String to = request.get("to");
        if (to == null || to.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email address 'to' is required"));
        }
        try {
            alertService.sendTestEmail(to);
            return ResponseEntity.ok(Map.of("message", "Test email sent to " + to));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}