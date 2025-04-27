package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.SessionDTO.*;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers/sessions")
@RequiredArgsConstructor
public class SessionCustomerController {

    private final SessionService sessionService;
    private final CustomerRepository customerRepository;

    // Get available sessions - accessible to customers and anonymous users
    @GetMapping("/available")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<SessionResponseDto>> getAvailableSessions() {
        return ResponseEntity.ok(sessionService.getAvailableSessions());
    }

    // Get sessions for the authenticated customer
    @GetMapping("/my-sessions")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<SessionResponseDto>> getMyEnrollments() {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(sessionService.getCustomerSessions(customerId));
    }

    // Enroll in a session - accessible to customers only
    @PostMapping("/enroll")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<SessionEnrollmentResponseDto> enrollInSession(
            @Valid @RequestBody SessionEnrollmentRequestDto dto
    ) {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(sessionService.enrollInSession(customerId, dto));
    }

    // Cancel session enrollment - accessible to customers only
    @PostMapping("/cancel/{sessionId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<SessionEnrollmentResponseDto> cancelEnrollment(
            @PathVariable Long sessionId
    ) {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(sessionService.cancelEnrollment(customerId, sessionId));
    }

    // Helper method to get current authenticated customer ID
    private Long getCurrentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
        return customer.getId();
    }
}