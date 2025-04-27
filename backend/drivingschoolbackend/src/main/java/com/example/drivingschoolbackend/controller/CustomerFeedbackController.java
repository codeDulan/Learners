package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.FeedbackDTO.*;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers/feedbacks")
@RequiredArgsConstructor
public class CustomerFeedbackController {

    private final FeedbackService feedbackService;
    private final CustomerRepository customerRepository;

    @GetMapping("/my-feedbacks")
    @PreAuthorize("hasRole('CUSTOMER')")  // Changed from hasAuthority to hasRole
    public ResponseEntity<List<FeedbackResponseDto>> getMyFeedbacks(Authentication authentication) {
        // In a real implementation, you'd extract the customer ID from the authentication
        // For now, assuming we have a method to get the customer ID from authentication
        Long customerId = getCustomerIdFromAuthentication(authentication);
        return ResponseEntity.ok(feedbackService.getFeedbacksByCustomerId(customerId));
    }

    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasRole('CUSTOMER')")  // Changed from hasAuthority to hasRole
    public ResponseEntity<List<FeedbackResponseDto>> getFeedbacksForSession(
            @PathVariable Long sessionId,
            Authentication authentication) {
        // Verify the customer is enrolled in this session before returning feedbacks
        Long customerId = getCustomerIdFromAuthentication(authentication);
        // Implementation would include verification logic
        return ResponseEntity.ok(feedbackService.getFeedbacksBySessionId(sessionId));
    }

    // Helper method to extract customer ID from authentication
    private Long getCustomerIdFromAuthentication(Authentication authentication) {
        // Get the customer email from the authentication token
        String customerEmail = authentication.getName();

        // Find the customer by email and return their ID
        // This assumes you have a customerRepository with a findByEmail method
        Customer customer = customerRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return customer.getId();
    }
}