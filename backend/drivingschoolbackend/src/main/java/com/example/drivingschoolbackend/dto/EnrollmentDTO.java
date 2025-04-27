package com.example.drivingschoolbackend.dto;

import com.example.drivingschoolbackend.entity.Enrollment;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class EnrollmentDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequestDTO {
        @NotNull
        private Long customerId;

        @NotNull
        private Long programId;

        private LocalDateTime startDate;
        private String notes;
        private Boolean isPaid;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateDTO {
        private Enrollment.EnrollmentStatus status;
        private LocalDateTime startDate;
        private LocalDateTime completionDate;
        private String notes;
        private Boolean isPaid;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseDTO {
        private Long id;
        private Long customerId;
        private String customerName;
        private String customerEmail;
        private Long programId;
        private String programName;
        private Enrollment.EnrollmentStatus status;
        private LocalDateTime enrollmentDate;
        private LocalDateTime startDate;
        private LocalDateTime completionDate;
        private String notes;
        private Boolean isPaid;
        private Integer programPrice;
    }
}