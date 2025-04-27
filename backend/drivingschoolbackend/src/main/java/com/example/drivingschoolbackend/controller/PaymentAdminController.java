package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.PaymentDTO;
import com.example.drivingschoolbackend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/payments")
@RequiredArgsConstructor
public class PaymentAdminController {

    private final PaymentService paymentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDTO.ResponseDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentDTO.ResponseDTO> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDTO.ResponseDTO>> getPaymentsByEnrollmentId(
            @PathVariable Long enrollmentId
    ) {
        return ResponseEntity.ok(paymentService.getPaymentsByEnrollmentId(enrollmentId));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDTO.ResponseDTO>> getPaymentsByCustomerId(
            @PathVariable Long customerId
    ) {
        return ResponseEntity.ok(paymentService.getPaymentsByCustomerId(customerId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentDTO.ResponseDTO> createPayment(
            @Valid @RequestBody PaymentDTO.RequestDTO requestDTO
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.createPayment(requestDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentDTO.ResponseDTO> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentDTO.UpdateDTO updateDTO
    ) {
        return ResponseEntity.ok(paymentService.updatePayment(id, updateDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}