package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.CustomerDto;
import com.example.drivingschoolbackend.dto.CustomerUpdateDto;
import com.example.drivingschoolbackend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/customers")
@RequiredArgsConstructor
public class StaffCustomerController {
    private final CustomerService customerService;

    // Get all customers - accessible to admin, worker, and instructor
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        List<CustomerDto> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Get customer by ID - accessible to admin, worker, and instructor
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        CustomerDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    // Update customer - accessible to admin and worker only
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER')")
    public ResponseEntity<CustomerDto> updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerUpdateDto customerUpdateDto
    ) {
        CustomerDto updatedCustomer = customerService.updateCustomer(id, customerUpdateDto);
        return ResponseEntity.ok(updatedCustomer);
    }

    // Delete customer - accessible to admin only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
}