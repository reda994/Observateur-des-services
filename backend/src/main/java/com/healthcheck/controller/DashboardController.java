package com.healthcheck.controller;

import com.healthcheck.service.DashboardStatistics;
import com.healthcheck.service.DashboardService;
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

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints for dashboard statistics and monitoring data")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get dashboard statistics", description = "Retrieves comprehensive dashboard statistics including service counts, uptime, and response times")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dashboard statistics retrieved successfully", content = @Content(schema = @Schema(implementation = DashboardStatistics.class)))
    })
    public ResponseEntity<DashboardStatistics> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardStatistics());
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get detailed statistics", description = "Retrieves detailed statistics for a specific time period (24h, 7d, 30d)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    })
    public ResponseEntity<?> getStatistics(
            @Parameter(description = "Time period for statistics (24h, 7d, 30d)", example = "24h") @RequestParam(required = false) String period) {
        return ResponseEntity.ok(dashboardService.getStatistics(period));
    }
}