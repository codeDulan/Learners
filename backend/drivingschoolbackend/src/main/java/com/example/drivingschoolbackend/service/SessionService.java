package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.SessionDTO.*;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.entity.Session;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.exception.SessionFullException;
import com.example.drivingschoolbackend.exception.SessionNotAvailableException;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final CustomerRepository customerRepository;

    // Admin functions

    public List<SessionResponseDto> getAllSessions() {
        return sessionRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SessionResponseDto getSessionById(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        // Force initialization of the collection within the transaction
        Hibernate.initialize(session.getEnrolledCustomers());

        return mapToResponseDto(session);
    }

    @Transactional
    public SessionResponseDto createSession(SessionCreateDto dto) {
        Session session = Session.builder()
                .title(dto.getTitle())
                .type(dto.getType())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .status(Session.SessionStatus.SCHEDULED)
                .licenseType(dto.getLicenseType())
                .notes(dto.getNotes())
                .maxCapacity(dto.getMaxCapacity())
                .isAvailable(true)
                .enrolledCustomers(new HashSet<>())
                .build();

        Session savedSession = sessionRepository.save(session);
        return mapToResponseDto(savedSession);
    }

    @Transactional
    public SessionResponseDto updateSession(Long id, SessionUpdateDto dto) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (dto.getTitle() != null) {
            session.setTitle(dto.getTitle());
        }

        if (dto.getType() != null) {
            session.setType(dto.getType());
        }

        if (dto.getStartTime() != null) {
            session.setStartTime(dto.getStartTime());
        }

        if (dto.getEndTime() != null) {
            session.setEndTime(dto.getEndTime());
        }

        if (dto.getStatus() != null) {
            session.setStatus(dto.getStatus());
        }

        if (dto.getLicenseType() != null) {
            session.setLicenseType(dto.getLicenseType());
        }

        if (dto.getNotes() != null) {
            session.setNotes(dto.getNotes());
        }

        if (dto.getMaxCapacity() != null) {
            session.setMaxCapacity(dto.getMaxCapacity());
        }

        if (dto.getIsAvailable() != null) {
            session.setAvailable(dto.getIsAvailable());
        }

        Session updatedSession = sessionRepository.save(session);
        return mapToResponseDto(updatedSession);
    }

    @Transactional
    public void deleteSession(Long id) {
        if (!sessionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Session not found");
        }
        sessionRepository.deleteById(id);
    }

    // Customer functions

    @Transactional(readOnly = true)
    public List<SessionResponseDto> getAvailableSessions() {
        List<Session> sessions = sessionRepository.findAvailableSessionsWithCustomers(LocalDateTime.now());

        if (sessions.isEmpty()) {
            // Return empty list instead of throwing an exception
            return Collections.emptyList();
        }

        return sessions.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }


    @Transactional
    public SessionEnrollmentResponseDto enrollInSession(Long customerId, SessionEnrollmentRequestDto dto) {
        Long sessionId = dto.getSessionId();

        try {
            // Verify session exists and has capacity
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

            // Verify customer exists
            if (!customerRepository.existsById(customerId)) {
                throw new ResourceNotFoundException("Customer not found");
            }

            if (!session.isAvailable()) {
                throw new SessionNotAvailableException("This session is not available for enrollment");
            }

            if (!session.hasCapacity()) {
                throw new SessionFullException("Session is already at full capacity");
            }

            // Check if already enrolled with direct query
            boolean alreadyEnrolled = sessionRepository.existsByIdAndEnrolledCustomers_Id(sessionId, customerId);

            if (alreadyEnrolled) {
                return new SessionEnrollmentResponseDto(false, "You are already enrolled in this session");
            }

            // Add enrollment directly in database
            sessionRepository.addCustomerToSession(sessionId, customerId);

            return new SessionEnrollmentResponseDto(true, "Successfully enrolled in session");
        } catch (ResourceNotFoundException e) {
            return new SessionEnrollmentResponseDto(false, e.getMessage());
        } catch (SessionNotAvailableException e) {
            return new SessionEnrollmentResponseDto(false, e.getMessage());
        } catch (SessionFullException e) {
            return new SessionEnrollmentResponseDto(false, e.getMessage());
        } catch (Exception e) {
            return new SessionEnrollmentResponseDto(false, "An unexpected error occurred: " + e.getMessage());
        }
    }

    @Transactional
    public SessionEnrollmentResponseDto cancelEnrollment(Long customerId, Long sessionId) {
        try {
            // Verify session exists
            if (!sessionRepository.existsById(sessionId)) {
                throw new ResourceNotFoundException("Session not found");
            }

            // Verify customer exists
            if (!customerRepository.existsById(customerId)) {
                throw new ResourceNotFoundException("Customer not found");
            }

            // Check if enrolled with direct query
            boolean isEnrolled = sessionRepository.existsByIdAndEnrolledCustomers_Id(sessionId, customerId);

            if (!isEnrolled) {
                return new SessionEnrollmentResponseDto(false, "You are not enrolled in this session");
            }

            // Remove enrollment directly in database
            sessionRepository.removeCustomerFromSession(sessionId, customerId);

            return new SessionEnrollmentResponseDto(true, "Successfully canceled enrollment");
        } catch (ResourceNotFoundException e) {
            return new SessionEnrollmentResponseDto(false, e.getMessage());
        } catch (Exception e) {
            return new SessionEnrollmentResponseDto(false, "An unexpected error occurred: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<SessionResponseDto> getCustomerSessions(Long customerId) {
        // Enhanced to use optimized query for better performance
        List<Session> sessions = sessionRepository.findEnrolledSessionsWithDetailsByCustomerId(customerId);

        return sessions.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private SessionResponseDto mapToResponseDto(Session session) {
        SessionResponseDto dto = new SessionResponseDto();
        dto.setId(session.getId());
        dto.setTitle(session.getTitle());
        dto.setType(session.getType());
        dto.setStartTime(session.getStartTime());
        dto.setEndTime(session.getEndTime());
        dto.setStatus(session.getStatus());
        dto.setLicenseType(session.getLicenseType());
        dto.setNotes(session.getNotes());
        dto.setMaxCapacity(session.getMaxCapacity());
        dto.setAvailable(session.isAvailable());

        int enrollmentCount = 0;
        Set<CustomerDto> customerDtos = new HashSet<>();

        // Check if collection is initialized before accessing it
        if (Hibernate.isInitialized(session.getEnrolledCustomers()) && session.getEnrolledCustomers() != null) {
            enrollmentCount = session.getEnrolledCustomers().size();

            // Make a safe copy to avoid concurrent modification
            List<Customer> safeCustomerList = new ArrayList<>(session.getEnrolledCustomers());

            for (Customer customer : safeCustomerList) {
                CustomerDto customerDto = new CustomerDto();
                customerDto.setId(customer.getId());
                customerDto.setFirstName(customer.getFirstName());
                customerDto.setLastName(customer.getLastName());
                customerDto.setEmail(customer.getEmail());
                customerDtos.add(customerDto);
            }
        }

        dto.setCurrentEnrollment(enrollmentCount);
        dto.setEnrolledCustomers(customerDtos);

        return dto;
    }
}