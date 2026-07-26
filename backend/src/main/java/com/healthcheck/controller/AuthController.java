package com.healthcheck.controller;

import com.healthcheck.model.User;
import com.healthcheck.repository.UserRepository;
import com.healthcheck.security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get JWT token", description = "Validates user credentials and returns a JWT token for authenticated requests")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Authentication successful", content = @Content(schema = @Schema(implementation = LoginResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid username or password", content = @Content(schema = @Schema(example = "{\"error\": \"Authentication failed: Bad credentials\"}")))
    })
    public ResponseEntity<?> login(@Parameter(description = "Login credentials", required = true) @RequestBody LoginRequest request) {
        try {
            System.out.println("Login attempt for user: " + request.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtUtils.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account with USER role")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User created successfully", content = @Content(schema = @Schema(example = "{\"message\": \"User created successfully\"}"))),
        @ApiResponse(responseCode = "400", description = "Username already exists", content = @Content(schema = @Schema(example = "{\"error\": \"Username already exists\"}")))
    })
    public ResponseEntity<?> register(@Parameter(description = "Registration details", required = true) @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User created successfully"));
    }

    @PostMapping("/reset-admin")
    @Operation(summary = "Reset admin password", description = "Resets the admin user password to 'admin123' and sets role to ADMIN. Useful for recovery.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Admin password reset successfully", content = @Content(schema = @Schema(example = "{\"message\": \"Admin password reset to admin123\"}"))),
        @ApiResponse(responseCode = "404", description = "Admin user not found")
    })
    public ResponseEntity<?> resetAdminPassword() {
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin != null) {
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            return ResponseEntity.ok(Map.of("message", "Admin password reset to admin123"));
        }
        return ResponseEntity.notFound().build();
    }

    @Data
    @Schema(description = "Login request payload")
    public static class LoginRequest {
        @Schema(description = "Username", example = "admin", required = true)
        private String username;
        @Schema(description = "Password", example = "admin123", required = true)
        private String password;
    }

    @Data
    @Schema(description = "Registration request payload")
    public static class RegisterRequest {
        @Schema(description = "Username (must be unique)", example = "newuser", required = true)
        private String username;
        @Schema(description = "Password", example = "password123", required = true)
        private String password;
    }

    @Data
    @Schema(description = "Login response payload")
    public static class LoginResponse {
        @Schema(description = "JWT authentication token")
        private String token;
        @Schema(description = "Username of authenticated user")
        private String username;
        @Schema(description = "User role (ADMIN or USER)")
        private String role;
    }
}