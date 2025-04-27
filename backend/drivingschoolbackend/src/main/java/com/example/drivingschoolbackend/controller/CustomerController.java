package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.CustomerDto;
import com.example.drivingschoolbackend.dto.CustomerUpdateDto;
import com.example.drivingschoolbackend.dto.PasswordChangeRequest;
import com.example.drivingschoolbackend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    // Admin/staff operation - Get all customers
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER')")  // Only admin and workers can see all customers
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        List<CustomerDto> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Get customer by ID - accessible by both customer (if their own ID) and staff
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // Check if it's a customer trying to access their own data
        boolean isCustomer = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"));

        if (isCustomer) {
            // Get customer by email to verify they're accessing their own record
            CustomerDto customerDto = customerService.getCustomerByEmail(email);
            if (!customerDto.getId().equals(id)) {
                return ResponseEntity.status(403).build(); // Forbidden
            }
        } else {
            // For staff, check if they have appropriate role
            boolean hasStaffAccess = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") ||
                            a.getAuthority().equals("ROLE_WORKER") ||
                            a.getAuthority().equals("ROLE_INSTRUCTOR"));
            if (!hasStaffAccess) {
                return ResponseEntity.status(403).build(); // Forbidden
            }
        }

        CustomerDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    // Update a customer - accessible by both customer (if their own) and staff
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerUpdateDto customerUpdateDto
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // Check if it's a customer trying to update their own data
        boolean isCustomer = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"));

        if (isCustomer) {
            // Get customer by email to verify they're updating their own record
            CustomerDto customerDto = customerService.getCustomerByEmail(email);
            if (!customerDto.getId().equals(id)) {
                return ResponseEntity.status(403).build(); // Forbidden
            }
        } else {
            // For staff, check if they have appropriate role
            boolean hasStaffAccess = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") ||
                            a.getAuthority().equals("ROLE_WORKER"));
            if (!hasStaffAccess) {
                return ResponseEntity.status(403).build(); // Forbidden
            }
        }

        CustomerDto updatedCustomer = customerService.updateCustomer(id, customerUpdateDto);
        return ResponseEntity.ok(updatedCustomer);
    }

    // Delete a customer - only staff with admin or worker role can do this
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WORKER')")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }

    // Get current customer's profile - only for logged-in customer
    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CustomerDto> getCurrentCustomer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        CustomerDto customer = customerService.getCustomerByEmail(email);
        return ResponseEntity.ok(customer);
    }


}