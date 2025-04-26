package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.StaffRegisterDto;
import com.example.drivingschoolbackend.entity.Users;
import com.example.drivingschoolbackend.exception.InvalidCredentialsException;
import com.example.drivingschoolbackend.repository.StaffRepository;
import com.example.drivingschoolbackend.security.JwtUtils;
import com.example.drivingschoolbackend.utils.PasswordUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffAuthService {
    private final StaffRepository staffRepository;
    private final JwtUtils jwtUtils;
    private final PasswordUtils passwordUtils;

    public String authenticateStaff(String email, String password) {
        Users staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Staff not found"));

        if (!passwordUtils.verifyPassword(password, staff.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        return jwtUtils.generateStaffToken(staff.getId(), staff.getEmail(), staff.getRole());
    }


    public Users registerStaff(StaffRegisterDto dto) {
        // Check if email exists
        if (staffRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Users staff = Users.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordUtils.hashPassword(dto.getPassword()))
                .role(dto.getRole())
                .employeeId(dto.getEmployeeId())
                .department(dto.getDepartment())
                .build();

        return staffRepository.save(staff);
    }

}