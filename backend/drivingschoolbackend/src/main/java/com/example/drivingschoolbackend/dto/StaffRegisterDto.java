package com.example.drivingschoolbackend.dto;

import com.example.drivingschoolbackend.entity.Users.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StaffRegisterDto {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8, max = 20)
    private String password;

    @NotNull
    private Role role; // ADMIN, WORKER, or INSTRUCTOR

    private String employeeId; // Optional for non-admins
    private String department;
}