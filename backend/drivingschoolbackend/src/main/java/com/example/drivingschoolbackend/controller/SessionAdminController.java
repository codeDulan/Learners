package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.SessionDTO.*;
import com.example.drivingschoolbackend.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/sessions")
@RequiredArgsConstructor
public class SessionAdminController {

    private final SessionService sessionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<List<SessionResponseDto>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<SessionResponseDto> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<SessionResponseDto> createSession(@Valid @RequestBody SessionCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.createSession(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<SessionResponseDto> updateSession(
            @PathVariable Long id,
            @RequestBody SessionUpdateDto dto
    ) {
        return ResponseEntity.ok(sessionService.updateSession(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}