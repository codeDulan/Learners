package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.PaymentDTO;
import com.example.drivingschoolbackend.entity.Enrollment;
import com.example.drivingschoolbackend.entity.Payment;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.EnrollmentRepository;
import com.example.drivingschoolbackend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;

    // Get all payments
    public List<PaymentDTO.ResponseDTO> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get payment by ID
    public PaymentDTO.ResponseDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return convertToResponseDTO(payment);
    }

    // Get payments by enrollment ID
    public List<PaymentDTO.ResponseDTO> getPaymentsByEnrollmentId(Long enrollmentId) {
        return paymentRepository.findByEnrollmentId(enrollmentId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get payments by customer ID
    public List<PaymentDTO.ResponseDTO> getPaymentsByCustomerId(Long customerId) {
        return paymentRepository.findPaymentsByCustomerIdOrderByDateDesc(customerId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Create a new payment
    @Transactional
    public PaymentDTO.ResponseDTO createPayment(PaymentDTO.RequestDTO requestDTO) {
        // Validate enrollment exists
        Enrollment enrollment = enrollmentRepository.findById(requestDTO.getEnrollmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + requestDTO.getEnrollmentId()));

        // Check if total paid + new payment exceeds program price
        BigDecimal totalPaid = paymentRepository.getTotalPaidAmountByEnrollmentId(enrollment.getId());
        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }

        BigDecimal programPrice = BigDecimal.valueOf(enrollment.getTrainingProgram().getPrice());

        if (totalPaid.add(requestDTO.getAmount()).compareTo(programPrice) > 0) {
            throw new IllegalArgumentException("Payment amount exceeds the remaining balance");
        }

        // Generate receipt number
        String receiptNumber = generateReceiptNumber();

        // Create payment entity
        Payment payment = Payment.builder()
                .enrollment(enrollment)
                .amount(requestDTO.getAmount())
                .paymentDate(LocalDateTime.now())
                .paymentMethod(requestDTO.getPaymentMethod())
                .status(Payment.PaymentStatus.COMPLETED)
                .description(requestDTO.getDescription())
                .receiptNumber(receiptNumber)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Update enrollment payment status if fully paid
        BigDecimal newTotalPaid = totalPaid.add(requestDTO.getAmount());
        if (newTotalPaid.compareTo(programPrice) >= 0) {
            enrollment.setIsPaid(true);
            enrollmentRepository.save(enrollment);
        }

        return convertToResponseDTO(savedPayment);
    }

    // Update payment
    @Transactional
    public PaymentDTO.ResponseDTO updatePayment(Long id, PaymentDTO.UpdateDTO updateDTO) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        if (updateDTO.getStatus() != null) {
            payment.setStatus(updateDTO.getStatus());
        }

        if (updateDTO.getPaymentMethod() != null) {
            payment.setPaymentMethod(updateDTO.getPaymentMethod());
        }

        if (updateDTO.getDescription() != null) {
            payment.setDescription(updateDTO.getDescription());
        }

        Payment updatedPayment = paymentRepository.save(payment);

        // Recalculate enrollment payment status
        Enrollment enrollment = payment.getEnrollment();
        BigDecimal totalPaid = paymentRepository.getTotalPaidAmountByEnrollmentId(enrollment.getId());
        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }

        BigDecimal programPrice = BigDecimal.valueOf(enrollment.getTrainingProgram().getPrice());
        boolean isFullyPaid = totalPaid.compareTo(programPrice) >= 0;

        if (enrollment.getIsPaid() != isFullyPaid) {
            enrollment.setIsPaid(isFullyPaid);
            enrollmentRepository.save(enrollment);
        }

        return convertToResponseDTO(updatedPayment);
    }

    // Delete payment
    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        paymentRepository.delete(payment);

        // Recalculate enrollment payment status
        Enrollment enrollment = payment.getEnrollment();
        BigDecimal totalPaid = paymentRepository.getTotalPaidAmountByEnrollmentId(enrollment.getId());
        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }

        BigDecimal programPrice = BigDecimal.valueOf(enrollment.getTrainingProgram().getPrice());
        boolean isFullyPaid = totalPaid.compareTo(programPrice) >= 0;

        if (enrollment.getIsPaid() != isFullyPaid) {
            enrollment.setIsPaid(isFullyPaid);
            enrollmentRepository.save(enrollment);
        }
    }

    // Convert Payment entity to PaymentDTO.ResponseDTO
    private PaymentDTO.ResponseDTO convertToResponseDTO(Payment payment) {
        Enrollment enrollment = payment.getEnrollment();

        // Calculate total paid and remaining amount
        BigDecimal totalPaid = paymentRepository.getTotalPaidAmountByEnrollmentId(enrollment.getId());
        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }

        BigDecimal programPrice = BigDecimal.valueOf(enrollment.getTrainingProgram().getPrice());
        BigDecimal remainingAmount = programPrice.subtract(totalPaid);

        // If remaining amount is negative, set to zero
        if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
            remainingAmount = BigDecimal.ZERO;
        }

        return PaymentDTO.ResponseDTO.builder()
                .id(payment.getId())
                .enrollmentId(enrollment.getId())
                .customerId(enrollment.getCustomer().getId())
                .customerName(enrollment.getCustomer().getFirstName() + " " + enrollment.getCustomer().getLastName())
                .customerEmail(enrollment.getCustomer().getEmail())
                .programId(enrollment.getTrainingProgram().getId())
                .programName(enrollment.getTrainingProgram().getName())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .description(payment.getDescription())
                .receiptNumber(payment.getReceiptNumber())
                .totalProgramPrice(programPrice)
                .totalPaid(totalPaid)
                .remainingAmount(remainingAmount)
                .build();
    }

    // Generate a unique receipt number
    private String generateReceiptNumber() {
        // Format: REC-{YYYYMMDD}-{5-digit-sequence}
        String datePart = LocalDateTime.now().toString().substring(0, 10).replace("-", "");

        // Get the count of payments for today to use as sequence
        long count = paymentRepository.count() + 1;
        String sequencePart = String.format("%05d", count % 100000);

        return "REC-" + datePart + "-" + sequencePart;
    }
}