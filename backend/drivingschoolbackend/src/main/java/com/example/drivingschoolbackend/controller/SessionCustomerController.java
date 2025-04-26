package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.SessionDTO.*;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/available")
    public ResponseEntity<List<SessionResponseDto>> getAvailableSessions() {
        return ResponseEntity.ok(sessionService.getAvailableSessions());
    }

    @GetMapping("/my-sessions")
    public ResponseEntity<List<SessionResponseDto>> getMyEnrollments() {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(sessionService.getCustomerSessions(customerId));
    }

    @PostMapping("/enroll")
    public ResponseEntity<SessionEnrollmentResponseDto> enrollInSession(
            @Valid @RequestBody SessionEnrollmentRequestDto dto
    ) {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(sessionService.enrollInSession(customerId, dto));
    }

    @PostMapping("/cancel/{sessionId}")
    public ResponseEntity<SessionEnrollmentResponseDto> cancelEnrollment(
            @PathVariable Long sessionId
    ) {
        Long customerId = getCurrentCustomerId();
        SessionEnrollmentRequestDto dto = new SessionEnrollmentRequestDto(sessionId);
        return ResponseEntity.ok(sessionService.cancelEnrollment(customerId, sessionId));
    }

    // Improved method to get current authenticated customer ID
    private Long getCurrentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with email: " + email));
        return customer.getId();
    }
}