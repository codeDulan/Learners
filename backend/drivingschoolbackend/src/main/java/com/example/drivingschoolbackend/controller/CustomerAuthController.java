package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.AuthResponse;
import com.example.drivingschoolbackend.dto.CustomerRegisterDto;
import com.example.drivingschoolbackend.dto.LoginRequest;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.service.CustomerAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers/auth")
@RequiredArgsConstructor
public class CustomerAuthController {
    private final CustomerAuthService customerAuthService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = customerAuthService.authenticateCustomer(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new AuthResponse(token, "Customer login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<Customer> registerCustomer(
            @Valid @RequestBody CustomerRegisterDto dto
    ) {
        Customer customer = customerAuthService.registerCustomer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(customer);
    }
}