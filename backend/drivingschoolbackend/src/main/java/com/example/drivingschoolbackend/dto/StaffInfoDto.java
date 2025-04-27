package com.example.drivingschoolbackend.dto;

import com.example.drivingschoolbackend.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffInfoDto {
    private Long id;
    private String name;
    private String email;
    private Users.Role role;
    private String employeeId;
    private String department;

    // Factory method to create from entity
    public static StaffInfoDto fromEntity(Users user) {
        return StaffInfoDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .employeeId(user.getEmployeeId())
                .department(user.getDepartment())
                .build();
    }
}