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

    @GetMapping
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    public ResponseEntity<List<FeedbackResponseDto>> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    public ResponseEntity<FeedbackResponseDto> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getFeedbackById(id));
    }

    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    public ResponseEntity<List<FeedbackResponseDto>> getFeedbacksBySessionId(@PathVariable Long sessionId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksBySessionId(sessionId));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    public ResponseEntity<List<FeedbackResponseDto>> getFeedbacksByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByCustomerId(customerId));
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    public ResponseEntity<List<FeedbackResponseDto>> getFeedbacksByInstructorId(@PathVariable Long instructorId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByInstructorId(instructorId));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    public ResponseEntity<FeedbackResponseDto> createFeedback(@Valid @RequestBody FeedbackCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.createFeedback(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    public ResponseEntity<FeedbackResponseDto> updateFeedback(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackUpdateDto dto
    ) {
        return ResponseEntity.ok(feedbackService.updateFeedback(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }
}