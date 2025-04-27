package com.example.drivingschoolbackend.repository;

import com.example.drivingschoolbackend.entity.Session;
import com.example.drivingschoolbackend.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
    List<TrainingProgram> findAllByOrderByIdDesc();
    List<TrainingProgram> findByLicenseType(Session.LicenseType licenseType);
    List<TrainingProgram> findByNameContainingIgnoreCase(String name);
}