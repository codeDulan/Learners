package com.example.drivingschoolbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "training_programs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Session.LicenseType licenseType;

    @Column(nullable = false)
    private String duration;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer price;

    // Store prerequisites as a comma-separated string, to be parsed on retrieval
    @Column(columnDefinition = "TEXT")
    private String prerequisites;
}