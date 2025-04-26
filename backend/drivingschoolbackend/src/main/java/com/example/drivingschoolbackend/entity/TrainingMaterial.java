package com.example.drivingschoolbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "training_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String category;

    private String description;

    @Column(nullable = false)
    private String filePath;

    private Long fileSize;

    @Column(nullable = false)
    private String forLicenseType;

    @Column(nullable = false)
    private String visibility;

    private Integer downloadCount;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    @Column(nullable = false)
    private String uploadedBy;
}