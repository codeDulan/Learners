package com.example.drivingschoolbackend.repository;

import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.entity.Enrollment;
import com.example.drivingschoolbackend.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByCustomerId(Long customerId);
    List<Enrollment> findByTrainingProgramId(Long programId);
    Optional<Enrollment> findByCustomerIdAndTrainingProgramId(Long customerId, Long programId);
    List<Enrollment> findByStatus(Enrollment.EnrollmentStatus status);
    boolean existsByCustomerIdAndTrainingProgramId(Long customerId, Long programId);
}