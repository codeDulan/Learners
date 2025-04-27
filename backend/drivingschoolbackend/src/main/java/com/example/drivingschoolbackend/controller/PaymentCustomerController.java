package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.PaymentDTO;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customer/payments")
@RequiredArgsConstructor
public class PaymentCustomerController {

    private final PaymentService paymentService;
    private final CustomerRepository customerRepository;

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<PaymentDTO.ResponseDTO>> getMyPayments(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Customer customer = customerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Customer not found with email: " + userDetails.getUsername()));

        return ResponseEntity.ok(paymentService.getPaymentsByCustomerId(customer.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentDTO.ResponseDTO> getPaymentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Customer customer = customerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Customer not found with email: " + userDetails.getUsername()));

        PaymentDTO.ResponseDTO payment = paymentService.getPaymentById(id);

        // Check if the payment belongs to the current customer
        if (!payment.getCustomerId().equals(customer.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(payment);
    }

    @GetMapping("/enrollment/{enrollmentId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<PaymentDTO.ResponseDTO>> getPaymentsByEnrollmentId(
            @PathVariable Long enrollmentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Customer customer = customerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("Customer not found with email: " + userDetails.getUsername()));

        List<PaymentDTO.ResponseDTO> payments = paymentService.getPaymentsByEnrollmentId(enrollmentId);

        // Check if any payments are returned and if they belong to the current customer
        if (!payments.isEmpty() && !payments.get(0).getCustomerId().equals(customer.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(payments);
    }
}