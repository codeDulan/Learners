package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.CustomerRegisterDto;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.exception.InvalidCredentialsException;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import com.example.drivingschoolbackend.security.JwtUtils;
import com.example.drivingschoolbackend.utils.PasswordUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CustomerAuthService {
    private final CustomerRepository customerRepository;
    private final JwtUtils jwtUtils;
    private final PasswordUtils passwordUtils;

    public String authenticateCustomer(String email, String password) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Customer not found"));

        if (!passwordUtils.verifyPassword(password, customer.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        return jwtUtils.generateCustomerToken(customer.getId(), customer.getEmail());
    }


    public Customer registerCustomer(CustomerRegisterDto dto) {
        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Customer customer = Customer.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .password(passwordUtils.hashPassword(dto.getPassword()))
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .nic(dto.getNic())
                .licenseNumber(dto.getLicenseNumber())
                .registeredAt(LocalDateTime.now())
                .build();

        return customerRepository.save(customer);
    }
}