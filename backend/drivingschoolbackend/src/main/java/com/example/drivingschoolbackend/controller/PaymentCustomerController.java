package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.PaymentDTO;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers/payments")
@RequiredArgsConstructor
public class PaymentCustomerController {

    private final PaymentService paymentService;
    private final CustomerRepository customerRepository;

    // Get payments for the authenticated customer
    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<PaymentDTO.ResponseDTO>> getMyPayments() {
        Long customerId = getCurrentCustomerId();
        return ResponseEntity.ok(paymentService.getPaymentsByCustomerId(customerId));
    }

    // Get specific payment by ID for the authenticated customer
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentDTO.ResponseDTO> getPaymentById(@PathVariable Long id) {
        Long customerId = getCurrentCustomerId();
        PaymentDTO.ResponseDTO payment = paymentService.getPaymentById(id);

        if (!payment.getCustomerId().equals(customerId)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(payment);
    }

    // Get payments by enrollment ID for the authenticated customer
    @GetMapping("/enrollment/{enrollmentId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<PaymentDTO.ResponseDTO>> getPaymentsByEnrollmentId(@PathVariable Long enrollmentId) {
        Long customerId = getCurrentCustomerId();
        List<PaymentDTO.ResponseDTO> payments = paymentService.getPaymentsByEnrollmentId(enrollmentId);

        if (!payments.isEmpty() && !payments.get(0).getCustomerId().equals(customerId)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(payments);
    }

    private Long getCurrentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
        return customer.getId();
    }
}