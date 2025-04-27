package com.example.drivingschoolbackend.dto;

import com.example.drivingschoolbackend.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminInfoDto {
    private Long id;
    private String name;
    private String email;
    private String employeeId;
    private String department;
    private String role;
    private LocalDateTime lastLoginAt;

    public static AdminInfoDto fromEntity(Users user) {
        return AdminInfoDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .employeeId(user.getEmployeeId())
                .department(user.getDepartment())
                .role(user.getRole().toString())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}