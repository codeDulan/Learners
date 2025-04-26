package com.example.drivingschoolbackend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CustomerRegisterDto {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8, max = 20)
    private String password;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$")
    private String phoneNumber;

    private String address;
    private String nic; // National ID
    private String licenseNumber;
}