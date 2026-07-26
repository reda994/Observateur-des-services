package com.healthcheck.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Schema(description = "User entity representing application users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "User unique identifier", example = "1")
    private Long id;

    @Column(unique = true, nullable = false)
    @Schema(description = "Username (must be unique)", example = "admin", required = true)
    private String username;

    @Column(nullable = false)
    @Schema(description = "Encrypted password", example = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH", required = true)
    private String password;

    @Enumerated(EnumType.STRING)
    @Schema(description = "User role", example = "ADMIN")
    private Role role = Role.USER;

    @Schema(description = "Account creation timestamp", example = "2024-01-15T10:30:00")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Schema(description = "User roles")
    public enum Role {
        @Schema(description = "Administrator with full access")
        ADMIN, 
        @Schema(description = "Regular user with limited access")
        USER
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}