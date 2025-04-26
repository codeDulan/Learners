package com.example.drivingschoolbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String nic;
    private String licenseNumber;
    private LocalDateTime registeredAt;
    private LocalDateTime lastActiveAt;
}
