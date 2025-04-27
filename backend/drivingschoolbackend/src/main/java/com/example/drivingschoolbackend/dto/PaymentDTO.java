package com.example.drivingschoolbackend.dto;

import com.example.drivingschoolbackend.entity.Payment;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequestDTO {
        @NotNull
        private Long enrollmentId;

        @NotNull
        @Positive
        private BigDecimal amount;

        @NotNull
        private Payment.PaymentMethod paymentMethod;

        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateDTO {
        private Payment.PaymentStatus status;
        private Payment.PaymentMethod paymentMethod;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseDTO {
        private Long id;
        private Long enrollmentId;
        private Long customerId;
        private String customerName;
        private String customerEmail;
        private Long programId;
        private String programName;
        private BigDecimal amount;
        private LocalDateTime paymentDate;
        private Payment.PaymentMethod paymentMethod;
        private Payment.PaymentStatus status;
        private String description;
        private String receiptNumber;
        private BigDecimal totalProgramPrice;
        private BigDecimal totalPaid;
        private BigDecimal remainingAmount;
    }
}