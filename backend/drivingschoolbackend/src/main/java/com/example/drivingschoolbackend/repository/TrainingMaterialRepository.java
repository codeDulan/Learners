package com.example.drivingschoolbackend.repository;

import com.example.drivingschoolbackend.entity.TrainingMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingMaterialRepository extends JpaRepository<TrainingMaterial, Long> {
    List<TrainingMaterial> findByForLicenseTypeOrForLicenseType(String licenseType, String allType);
}