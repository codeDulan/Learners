package com.example.drivingschoolbackend.repository;

import com.example.drivingschoolbackend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Find feedback by session and customer
    Optional<Feedback> findBySession_IdAndCustomer_Id(Long sessionId, Long customerId);

    // Find all feedback for a specific customer
    List<Feedback> findByCustomer_Id(Long customerId);

    // Find all feedback given by a specific instructor
    List<Feedback> findByInstructor_Id(Long instructorId);

    // Find all feedback for a specific session
    List<Feedback> findBySession_Id(Long sessionId);

    // Find all feedback for sessions of a specific type
    @Query("SELECT f FROM Feedback f JOIN f.session s WHERE s.type = :sessionType")
    List<Feedback> findBySessionType(@Param("sessionType") String sessionType);

    // Check if feedback exists for a session and customer
    boolean existsBySession_IdAndCustomer_Id(Long sessionId, Long customerId);
}