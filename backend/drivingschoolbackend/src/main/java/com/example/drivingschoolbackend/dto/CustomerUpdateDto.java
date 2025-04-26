package com.example.drivingschoolbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerUpdateDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String nic;
    private String licenseNumber;
}
