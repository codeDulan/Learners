package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.CustomerDto;
import com.example.drivingschoolbackend.dto.CustomerUpdateDto;
import com.example.drivingschoolbackend.entity.Customer;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    // Fetch all customers and map to DTOs
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToCustomerDto)
                .collect(Collectors.toList());
    }

    // Fetch single customer by ID and map to DTO
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return convertToCustomerDto(customer);
    }

    // Get customer by email
    public CustomerDto getCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
        return convertToCustomerDto(customer);
    }

    // Update a customer's data using a CustomerUpdateDto
    public CustomerDto updateCustomer(Long id, CustomerUpdateDto customerUpdateDto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customer.setFirstName(customerUpdateDto.getFirstName());
        customer.setLastName(customerUpdateDto.getLastName());
        customer.setPhoneNumber(customerUpdateDto.getPhoneNumber());
        customer.setAddress(customerUpdateDto.getAddress());
        customer.setNic(customerUpdateDto.getNic());
        customer.setLicenseNumber(customerUpdateDto.getLicenseNumber());
        customer.setLastActiveAt(LocalDateTime.now());

        Customer updatedCustomer = customerRepository.save(customer);
        return convertToCustomerDto(updatedCustomer);
    }

    // Delete a customer
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customerRepository.delete(customer);
    }

    // Change password functionality
    public void changePassword(String email, String currentPassword, String newPassword) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));

        // Verify current password is correct
        if (!passwordEncoder.matches(currentPassword, customer.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Encode and save new password
        customer.setPassword(passwordEncoder.encode(newPassword));
        customer.setLastActiveAt(LocalDateTime.now());
        customerRepository.save(customer);
    }

    // Helper method to convert Entity -> DTO
    private CustomerDto convertToCustomerDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setAddress(customer.getAddress());
        dto.setNic(customer.getNic());
        dto.setLicenseNumber(customer.getLicenseNumber());
        dto.setRegisteredAt(customer.getRegisteredAt());
        dto.setLastActiveAt(customer.getLastActiveAt());
        return dto;
    }
}