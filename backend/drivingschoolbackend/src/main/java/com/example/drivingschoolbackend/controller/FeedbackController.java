package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.FeedbackDTO.*;
import com.example.drivingschoolbackend.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    // Get all feedbacks - accessible to admin, worker, and instructor
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<List<FeedbackResponseDto>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    // Get feedback by ID - accessible to admin, worker, and instructor
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<FeedbackResponseDto> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getFeedbackById(id));
    }

    // Get feedbacks by session ID - accessible to admin, worker, and instructor
    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<List<FeedbackResponseDto>> getFeedbacksBySessionId(@PathVariable Long sessionId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksBySessionId(sessionId));
    }

    // Get feedbacks by customer ID - accessible to admin, worker, and instructor
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<List<FeedbackResponseDto>> getFeedbacksByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByCustomerId(customerId));
    }

    // Get feedbacks by instructor ID - accessible to admin, worker, and instructor
    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<List<FeedbackResponseDto>> getFeedbacksByInstructorId(@PathVariable Long instructorId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByInstructorId(instructorId));
    }

    // Create feedback - accessible to instructor only
    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<FeedbackResponseDto> createFeedback(@Valid @RequestBody FeedbackCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.createFeedback(dto));
    }

    // Update feedback - accessible to instructor only
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<FeedbackResponseDto> updateFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackUpdateDto dto
    ) {
        return ResponseEntity.ok(feedbackService.updateFeedback(id, dto));
    }

    // Delete feedback - accessible to admin and instructor
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}