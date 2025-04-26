package com.example.drivingschoolbackend.dto;

import com.example.drivingschoolbackend.entity.Session;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

public class SessionDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SessionCreateDto {
        private String title;

        @NotNull
        private Session.SessionType type;

        @NotNull
        @Future
        private LocalDateTime startTime;

        @NotNull
        @Future
        private LocalDateTime endTime;

        @NotNull
        private Session.LicenseType licenseType;

        private String notes;

        @NotNull
        @Min(1)
        private int maxCapacity = 5; // Default to 5
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SessionUpdateDto {
        private String title;
        private Session.SessionType type;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Session.SessionStatus status;
        private Session.LicenseType licenseType;
        private String notes;
        private Integer maxCapacity;
        private Boolean isAvailable;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SessionResponseDto {
        private Long id;
        private String title;
        private Session.SessionType type;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Session.SessionStatus status;
        private Session.LicenseType licenseType;
        private String notes;
        private int maxCapacity;
        private boolean isAvailable;
        private int currentEnrollment;
        private Set<CustomerDto> enrolledCustomers;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CustomerDto {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SessionEnrollmentRequestDto {
        @NotNull
        private Long sessionId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SessionEnrollmentResponseDto {
        private boolean successful;
        private String message;
    }
}