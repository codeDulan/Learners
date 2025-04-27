package com.example.drivingschoolbackend.repository;

import com.example.drivingschoolbackend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByEnrollmentId(Long enrollmentId);

    List<Payment> findByEnrollmentCustomerId(Long customerId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.enrollment.id = :enrollmentId AND p.status = 'COMPLETED'")
    BigDecimal getTotalPaidAmountByEnrollmentId(@Param("enrollmentId") Long enrollmentId);

    @Query("SELECT p FROM Payment p WHERE p.enrollment.customer.id = :customerId ORDER BY p.paymentDate DESC")
    List<Payment> findPaymentsByCustomerIdOrderByDateDesc(@Param("customerId") Long customerId);
}