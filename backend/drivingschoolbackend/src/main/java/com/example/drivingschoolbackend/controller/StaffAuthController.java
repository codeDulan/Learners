package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.AuthResponse;
import com.example.drivingschoolbackend.dto.LoginRequest;
import com.example.drivingschoolbackend.dto.StaffRegisterDto;
import com.example.drivingschoolbackend.entity.Users;
import com.example.drivingschoolbackend.service.StaffAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff/auth")
@RequiredArgsConstructor
public class StaffAuthController {
    private final StaffAuthService staffAuthService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = staffAuthService.authenticateStaff(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new AuthResponse(token, "Staff login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<Users> registerStaff(@Valid @RequestBody StaffRegisterDto dto) {
        Users staff = staffAuthService.registerStaff(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(staff);
    }
}