package com.example.drivingschoolbackend.dto;

import com.example.drivingschoolbackend.entity.Feedback;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class FeedbackDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedbackCreateDto {
        @NotNull
        private Long sessionId;

        @NotNull
        private Long customerId;

        @NotBlank
        @Size(min = 10, max = 2000)
        private String comment;

        @NotNull
        private Feedback.Rating rating;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedbackUpdateDto {
        @Size(min = 10, max = 2000)
        private String comment;

        private Feedback.Rating rating;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedbackResponseDto {
        private Long id;
        private Long sessionId;
        private String sessionTitle;
        private Long customerId;
        private String customerName;
        private String customerEmail;
        private Long instructorId;
        private String instructorName;
        private String comment;
        private Feedback.Rating rating;
        private LocalDateTime createdAt;
    }
}