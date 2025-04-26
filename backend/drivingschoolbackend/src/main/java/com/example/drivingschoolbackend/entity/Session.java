package com.example.drivingschoolbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String title;

    @Enumerated(EnumType.STRING)
    private SessionType type;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    @Enumerated(EnumType.STRING)
    private LicenseType licenseType;

    private String notes;
    private int maxCapacity;
    private boolean isAvailable;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "session_customers",
            joinColumns = @JoinColumn(name = "session_id"),
            inverseJoinColumns = @JoinColumn(name = "customer_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<Customer> enrolledCustomers = new HashSet<>();

    public boolean hasCapacity() {
        return enrolledCustomers.size() < maxCapacity;
    }

    public enum SessionType {
        PRACTICAL,
        THEORY,
        TEST
    }

    public enum SessionStatus {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    public enum LicenseType {
        MOTORCYCLE,
        LIGHT_VEHICLE,
        HEAVY_VEHICLE
    }
}