package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.AdminInfoDto;
import com.example.drivingschoolbackend.dto.AdminPasswordChangeRequest;
import com.example.drivingschoolbackend.dto.AdminUpdateDto;
import com.example.drivingschoolbackend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")  // Changed to /api/staff
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/admin/info")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')")  // Changed from hasRole to hasAuthority
    public ResponseEntity<AdminInfoDto> getAdminInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        AdminInfoDto adminInfo = adminService.getAdminInfoByEmail(email);
        return ResponseEntity.ok(adminInfo);
    }

    @PutMapping("/admin/update-info")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')") // Changed from hasRole to hasAuthority
    public ResponseEntity<AdminInfoDto> updateAdminInfo(@RequestBody AdminUpdateDto adminUpdateDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        AdminInfoDto updatedAdmin = adminService.updateAdminInfoByEmail(email, adminUpdateDto);
        return ResponseEntity.ok(updatedAdmin);
    }

    @PostMapping("/admin/change-password")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')") // Changed from hasRole to hasAuthority
    public ResponseEntity<Void> changePassword(@RequestBody AdminPasswordChangeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        adminService.changeAdminPasswordByEmail(email, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }
}