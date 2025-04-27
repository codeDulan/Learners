package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.CustomerDto;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers/profile")
@RequiredArgsConstructor
public class CustomerProfileController {

    private final CustomerRepository customerRepository;

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")  // Added security annotation
    public ResponseEntity<CustomerDto> getMyProfile() {
        Customer customer = getCurrentCustomer();
        CustomerDto customerDto = mapToDto(customer);
        return ResponseEntity.ok(customerDto);
    }

    private Customer getCurrentCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with email: " + email));
    }

    private CustomerDto mapToDto(Customer customer) {
        return CustomerDto.builder()
                .id(customer.getId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phoneNumber(customer.getPhoneNumber())
                .address(customer.getAddress())
                .nic(customer.getNic())
                .build();
    }
}