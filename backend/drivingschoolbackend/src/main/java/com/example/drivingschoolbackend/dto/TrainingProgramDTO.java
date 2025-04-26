package com.example.drivingschoolbackend.dto;

import com.example.drivingschoolbackend.entity.Session;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class TrainingProgramDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseDTO {
        private Long id;
        private String name;
        private Session.LicenseType licenseType;
        private String duration;
        private String description;
        private Integer price;
        private List<String> prerequisites;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateDTO {
        @NotBlank(message = "Program name is required")
        private String name;

        @NotNull(message = "License type is required")
        private Session.LicenseType licenseType;

        @NotBlank(message = "Duration is required")
        private String duration;

        private String description;

        @NotNull(message = "Price is required")
        @Min(value = 0, message = "Price must be positive")
        private Integer price;

        private List<String> prerequisites;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateDTO {
        private String name;
        private Session.LicenseType licenseType;
        private String duration;
        private String description;
        private Integer price;
        private List<String> prerequisites;
    }
}