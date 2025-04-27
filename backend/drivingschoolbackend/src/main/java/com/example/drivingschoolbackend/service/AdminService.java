package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.AdminInfoDto;
import com.example.drivingschoolbackend.dto.AdminUpdateDto;
import com.example.drivingschoolbackend.entity.Users;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final StaffRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInfoDto getAdminInfo(Long adminId) {
        Users admin = usersRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        // Ensure that we are retrieving an admin
        if (admin.getRole() != Users.Role.ADMIN) {
            throw new IllegalArgumentException("User is not an admin");
        }

        return AdminInfoDto.fromEntity(admin);
    }

    public AdminInfoDto updateAdminInfo(Long adminId, AdminUpdateDto adminUpdateDto) {
        Users admin = usersRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        // Ensure that we are updating an admin
        if (admin.getRole() != Users.Role.ADMIN) {
            throw new IllegalArgumentException("User is not an admin");
        }

        admin.setName(adminUpdateDto.getName());
        admin.setEmployeeId(adminUpdateDto.getEmployeeId());
        admin.setDepartment(adminUpdateDto.getDepartment());
        admin.setUpdatedAt(LocalDateTime.now());

        Users updatedAdmin = usersRepository.save(admin);
        return AdminInfoDto.fromEntity(updatedAdmin);
    }

    public void changeAdminPassword(Long adminId, String currentPassword, String newPassword) {
        Users admin = usersRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        // Ensure that we are changing password for an admin
        if (admin.getRole() != Users.Role.ADMIN) {
            throw new IllegalArgumentException("User is not an admin");
        }

        // Verify current password is correct
        if (!passwordEncoder.matches(currentPassword, admin.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Password validation
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        // Encode and save new password
        admin.setPassword(passwordEncoder.encode(newPassword));
        admin.setUpdatedAt(LocalDateTime.now());
        usersRepository.save(admin);
    }

    public AdminInfoDto getAdminInfoByEmail(String email) {
        Users staff = usersRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with email: " + email));

        // Accept any staff role (ADMIN, WORKER, INSTRUCTOR)
        if (staff.getRole() != Users.Role.ADMIN &&
                staff.getRole() != Users.Role.WORKER &&
                staff.getRole() != Users.Role.INSTRUCTOR) {
            throw new IllegalArgumentException("User is not a staff member");
        }

        return AdminInfoDto.fromEntity(staff);
    }

    public AdminInfoDto updateAdminInfoByEmail(String email, AdminUpdateDto adminUpdateDto) {
        Users staff = usersRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with email: " + email));

        // Accept any staff role (ADMIN, WORKER, INSTRUCTOR)
        if (staff.getRole() != Users.Role.ADMIN &&
                staff.getRole() != Users.Role.WORKER &&
                staff.getRole() != Users.Role.INSTRUCTOR) {
            throw new IllegalArgumentException("User is not a staff member");
        }

        staff.setName(adminUpdateDto.getName());
        staff.setEmployeeId(adminUpdateDto.getEmployeeId());
        staff.setDepartment(adminUpdateDto.getDepartment());
        staff.setUpdatedAt(LocalDateTime.now());

        Users updatedStaff = usersRepository.save(staff);
        return AdminInfoDto.fromEntity(updatedStaff);
    }

    public void changeAdminPasswordByEmail(String email, String currentPassword, String newPassword) {
        Users staff = usersRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with email: " + email));

        // Accept any staff role (ADMIN, WORKER, INSTRUCTOR)
        if (staff.getRole() != Users.Role.ADMIN &&
                staff.getRole() != Users.Role.WORKER &&
                staff.getRole() != Users.Role.INSTRUCTOR) {
            throw new IllegalArgumentException("User is not a staff member");
        }

        // Verify current password is correct
        if (!passwordEncoder.matches(currentPassword, staff.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Password validation
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }

        // Encode and save new password
        staff.setPassword(passwordEncoder.encode(newPassword));
        staff.setUpdatedAt(LocalDateTime.now());
        usersRepository.save(staff);
    }
}