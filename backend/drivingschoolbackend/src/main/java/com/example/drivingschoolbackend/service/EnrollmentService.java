package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.EnrollmentDTO;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.entity.Enrollment;
import com.example.drivingschoolbackend.entity.TrainingProgram;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.repository.EnrollmentRepository;
import com.example.drivingschoolbackend.repository.TrainingProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CustomerRepository customerRepository;
    private final TrainingProgramRepository trainingProgramRepository;

    public List<EnrollmentDTO.ResponseDTO> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<EnrollmentDTO.ResponseDTO> getEnrollmentsByCustomerId(Long customerId) {
        return enrollmentRepository.findByCustomerId(customerId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<EnrollmentDTO.ResponseDTO> getEnrollmentsByProgramId(Long programId) {
        return enrollmentRepository.findByTrainingProgramId(programId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public EnrollmentDTO.ResponseDTO getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));
        return convertToResponseDTO(enrollment);
    }

    @Transactional
    public EnrollmentDTO.ResponseDTO createEnrollment(EnrollmentDTO.RequestDTO requestDTO) {
        // Check if customer exists
        Customer customer = customerRepository.findById(requestDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + requestDTO.getCustomerId()));

        // Check if program exists
        TrainingProgram program = trainingProgramRepository.findById(requestDTO.getProgramId())
                .orElseThrow(() -> new ResourceNotFoundException("Training program not found with id: " + requestDTO.getProgramId()));

        // Check if the customer is already enrolled in this program
        if (enrollmentRepository.existsByCustomerIdAndTrainingProgramId(
                requestDTO.getCustomerId(), requestDTO.getProgramId())) {
            throw new IllegalStateException("Customer is already enrolled in this program");
        }

        Enrollment enrollment = Enrollment.builder()
                .customer(customer)
                .trainingProgram(program)
                .status(Enrollment.EnrollmentStatus.PENDING)
                .enrollmentDate(LocalDateTime.now())
                .startDate(requestDTO.getStartDate())
                .notes(requestDTO.getNotes())
                .isPaid(requestDTO.getIsPaid() != null ? requestDTO.getIsPaid() : false)
                .build();

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return convertToResponseDTO(savedEnrollment);
    }

    @Transactional
    public EnrollmentDTO.ResponseDTO updateEnrollment(Long id, EnrollmentDTO.UpdateDTO updateDTO) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));

        if (updateDTO.getStatus() != null) {
            enrollment.setStatus(updateDTO.getStatus());
        }

        if (updateDTO.getStartDate() != null) {
            enrollment.setStartDate(updateDTO.getStartDate());
        }

        if (updateDTO.getCompletionDate() != null) {
            enrollment.setCompletionDate(updateDTO.getCompletionDate());
        }

        if (updateDTO.getNotes() != null) {
            enrollment.setNotes(updateDTO.getNotes());
        }

        if (updateDTO.getIsPaid() != null) {
            enrollment.setIsPaid(updateDTO.getIsPaid());
        }

        Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
        return convertToResponseDTO(updatedEnrollment);
    }

    @Transactional
    public void deleteEnrollment(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enrollment not found with id: " + id);
        }
        enrollmentRepository.deleteById(id);
    }

    private EnrollmentDTO.ResponseDTO convertToResponseDTO(Enrollment enrollment) {
        Customer customer = enrollment.getCustomer();
        TrainingProgram program = enrollment.getTrainingProgram();

        return EnrollmentDTO.ResponseDTO.builder()
                .id(enrollment.getId())
                .customerId(customer.getId())
                .customerName(customer.getFirstName() + " " + customer.getLastName())
                .customerEmail(customer.getEmail())
                .programId(program.getId())
                .programName(program.getName())
                .status(enrollment.getStatus())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .startDate(enrollment.getStartDate())
                .completionDate(enrollment.getCompletionDate())
                .notes(enrollment.getNotes())
                .isPaid(enrollment.getIsPaid())
                .programPrice(program.getPrice())
                .build();
    }
}