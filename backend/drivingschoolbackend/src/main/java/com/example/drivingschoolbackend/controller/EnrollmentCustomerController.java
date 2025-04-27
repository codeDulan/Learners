package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.EnrollmentDTO;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers/enrollments")
@RequiredArgsConstructor
public class EnrollmentCustomerController {

    private final EnrollmentService enrollmentService;
    private final CustomerRepository customerRepository;

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")  // Added security annotation
    public ResponseEntity<List<EnrollmentDTO.ResponseDTO>> getMyEnrollments() {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCustomerId(customerId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")  // Added security annotation
    public ResponseEntity<EnrollmentDTO.ResponseDTO> getEnrollmentById(@PathVariable Long id) {
        Long customerId = getCurrentCustomerId();
        EnrollmentDTO.ResponseDTO enrollment = enrollmentService.getEnrollmentById(id);

        if (!enrollment.getCustomerId().equals(customerId)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(enrollment);
    }

    private Long getCurrentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with email: " + email));
        return customer.getId();
    }
}