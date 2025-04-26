package com.example.drivingschoolbackend.repository;

import com.example.drivingschoolbackend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    // Basic queries
    List<Session> findByIsAvailableTrue();

    List<Session> findByIsAvailableTrueAndStartTimeAfter(LocalDateTime now);

    List<Session> findByEnrolledCustomers_Id(Long customerId);

    boolean existsByIdAndEnrolledCustomers_Id(Long sessionId, Long customerId);

    // Optimized queries for finding sessions by type
    @Query("SELECT s FROM Session s WHERE s.isAvailable = true AND s.startTime > :now AND s.type = :type")
    List<Session> findAvailableSessionsByType(@Param("now") LocalDateTime now, @Param("type") Session.SessionType type);

    @Query("SELECT s FROM Session s WHERE s.isAvailable = true AND s.startTime > :now AND s.licenseType = :licenseType")
    List<Session> findAvailableSessionsByLicenseType(@Param("now") LocalDateTime now, @Param("licenseType") Session.LicenseType licenseType);

    // Enrollment related queries
    @Query("SELECT COUNT(c) FROM Session s JOIN s.enrolledCustomers c WHERE s.id = :sessionId")
    int countEnrolledCustomers(@Param("sessionId") Long sessionId);

    // Improved query to fetch available sessions with customers efficiently
    @Query("SELECT DISTINCT s FROM Session s LEFT JOIN FETCH s.enrolledCustomers WHERE s.isAvailable = true AND s.startTime > :startTime")
    List<Session> findAvailableSessionsWithCustomers(@Param("startTime") LocalDateTime startTime);

    @Query("SELECT DISTINCT s FROM Session s LEFT JOIN FETCH s.enrolledCustomers WHERE s.id IN " +
            "(SELECT DISTINCT se.id FROM Session se JOIN se.enrolledCustomers c WHERE c.id = :customerId)")
    List<Session> findEnrolledSessionsWithDetailsByCustomerId(@Param("customerId") Long customerId);

    // Enrollment management with better error handling
    @Modifying
    @Query(value = "INSERT INTO session_customers (session_id, customer_id) VALUES (:sessionId, :customerId)", nativeQuery = true)
    void addCustomerToSession(@Param("sessionId") Long sessionId, @Param("customerId") Long customerId);

    @Modifying
    @Query(value = "DELETE FROM session_customers WHERE session_id = :sessionId AND customer_id = :customerId", nativeQuery = true)
    void removeCustomerFromSession(@Param("sessionId") Long sessionId, @Param("customerId") Long customerId);
}