package com.example.drivingschoolbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

public class TrainingMaterialDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResponseDTO {
        private Long id;
        private String name;
        private String fileType;
        private String category;
        private String description;
        private Long fileSize;
        private String forLicenseType;
        private String visibility;
        private Integer downloadCount;
        private LocalDateTime uploadDate;
        private String uploadedBy;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateDTO {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Category is required")
        private String category;

        private String description;

        @NotBlank(message = "License type is required")
        private String forLicenseType;

        @NotBlank(message = "Visibility is required")
        private String visibility;

        // We don't include the file here as it will be handled separately in MultipartFile
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateDTO {
        private String name;
        private String category;
        private String description;
        private String forLicenseType;
        private String visibility;
    }
}