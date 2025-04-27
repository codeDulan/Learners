package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.StaffInfoDto;
import com.example.drivingschoolbackend.entity.Users;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.StaffRepository;
import com.example.drivingschoolbackend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {
    private final StaffRepository staffRepository;
    private final JwtUtils jwtUtils;

    @GetMapping("/me")
    public ResponseEntity<StaffInfoDto> getCurrentStaffInfo(
            @RequestHeader("Authorization") String authHeader) {
        // Extract token from Authorization header
        String token = authHeader.replace("Bearer ", "");

        // Extract staff email from token
        String email = jwtUtils.getEmailFromToken(token);

        // Find user by email
        Users staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with email: " + email));

        // Convert to DTO and return
        StaffInfoDto staffInfo = StaffInfoDto.fromEntity(staff);
        return ResponseEntity.ok(staffInfo);
    }
}