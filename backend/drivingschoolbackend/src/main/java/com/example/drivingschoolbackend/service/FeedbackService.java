package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.FeedbackDTO.*;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.entity.Feedback;
import com.example.drivingschoolbackend.entity.Session;
import com.example.drivingschoolbackend.entity.Users;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.repository.FeedbackRepository;
import com.example.drivingschoolbackend.repository.SessionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


import com.example.drivingschoolbackend.repository.StaffRepository;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final SessionRepository sessionRepository;
    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;

    @Transactional(readOnly = true)
    public List<FeedbackResponseDto> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FeedbackResponseDto getFeedbackById(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));
        return mapToResponseDto(feedback);
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponseDto> getFeedbacksBySessionId(Long sessionId) {
        return feedbackRepository.findBySession_Id(sessionId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponseDto> getFeedbacksByCustomerId(Long customerId) {
        return feedbackRepository.findByCustomer_Id(customerId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponseDto> getFeedbacksByInstructorId(Long instructorId) {
        return feedbackRepository.findByInstructor_Id(instructorId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackResponseDto createFeedback(FeedbackCreateDto dto) {
        // Get the current logged-in instructor email from JWT token
        String instructorEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Users instructor = staffRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        // Verify session exists
        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        // Verify customer exists
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Check if customer is enrolled in the session
        boolean isEnrolled = sessionRepository.existsByIdAndEnrolledCustomers_Id(dto.getSessionId(), dto.getCustomerId());
        if (!isEnrolled) {
            throw new IllegalArgumentException("Customer is not enrolled in this session");
        }

        // Check if feedback already exists
        boolean feedbackExists = feedbackRepository.existsBySession_IdAndCustomer_Id(dto.getSessionId(), dto.getCustomerId());
        if (feedbackExists) {
            throw new IllegalArgumentException("Feedback already exists for this session and customer");
        }

        Feedback feedback = Feedback.builder()
                .session(session)
                .customer(customer)
                .instructor(instructor)
                .comment(dto.getComment())
                .rating(dto.getRating())
                .createdAt(LocalDateTime.now())
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return mapToResponseDto(savedFeedback);
    }

    @Transactional
    public FeedbackResponseDto updateFeedback(Long id, FeedbackUpdateDto dto) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        // Get the current logged-in instructor email from JWT token
        String instructorEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Users instructor = staffRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        // Check if the instructor is the one who created the feedback
        if (!feedback.getInstructor().getId().equals(instructor.getId())) {
            throw new IllegalArgumentException("You can only update feedback that you created");
        }

        if (dto.getComment() != null) {
            feedback.setComment(dto.getComment());
        }

        if (dto.getRating() != null) {
            feedback.setRating(dto.getRating());
        }

        Feedback updatedFeedback = feedbackRepository.save(feedback);
        return mapToResponseDto(updatedFeedback);
    }

    @Transactional
    public void deleteFeedback(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        // Get the current logged-in instructor email from JWT token
        String instructorEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Users instructor = staffRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        // Check if the instructor is the one who created the feedback
        if (!feedback.getInstructor().getId().equals(instructor.getId())) {
            throw new IllegalArgumentException("You can only delete feedback that you created");
        }

        feedbackRepository.deleteById(id);
    }

    private FeedbackResponseDto mapToResponseDto(Feedback feedback) {
        FeedbackResponseDto dto = new FeedbackResponseDto();
        dto.setId(feedback.getId());
        dto.setSessionId(feedback.getSession().getId());
        dto.setSessionTitle(feedback.getSession().getTitle());
        dto.setCustomerId(feedback.getCustomer().getId());
        dto.setCustomerName(feedback.getCustomer().getFirstName() + " " + feedback.getCustomer().getLastName());
        dto.setCustomerEmail(feedback.getCustomer().getEmail());
        dto.setInstructorId(feedback.getInstructor().getId());
        dto.setInstructorName(feedback.getInstructor().getName());
        dto.setComment(feedback.getComment());
        dto.setRating(feedback.getRating());
        dto.setCreatedAt(feedback.getCreatedAt());
        return dto;
    }
}