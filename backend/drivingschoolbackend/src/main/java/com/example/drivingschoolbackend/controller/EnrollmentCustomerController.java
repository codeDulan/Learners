package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.EnrollmentDTO;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/enrollments")
@RequiredArgsConstructor
public class EnrollmentCustomerController {

    private final EnrollmentService enrollmentService;
    private final CustomerRepository customerRepository;

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<EnrollmentDTO.ResponseDTO>> getMyEnrollments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Customer customer = customerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Customer not found with email: " + userDetails.getUsername()));

        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCustomerId(customer.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<EnrollmentDTO.ResponseDTO> getEnrollmentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Customer customer = customerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Customer not found with email: " + userDetails.getUsername()));

        EnrollmentDTO.ResponseDTO enrollment = enrollmentService.getEnrollmentById(id);

        // Verify that the enrollment belongs to the current customer
        if (!enrollment.getCustomerId().equals(customer.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(enrollment);
    }
}