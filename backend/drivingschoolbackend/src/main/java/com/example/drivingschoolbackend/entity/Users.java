package com.example.drivingschoolbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "staff_users") // Explicit table name
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class) // For automatic timestamps
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // Only ADMIN or WORKER

    // Staff-specific fields (nullable for flexibility)
    private String employeeId;
    private String department;

    // Timestamps (auto-managed)
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt;

    // For JWT refresh tokens (optional)
    private String refreshToken;

    public enum Role {
        ADMIN,
        WORKER,
        INSTRUCTOR
        // No CUSTOMER here (handled separately)
    }
}