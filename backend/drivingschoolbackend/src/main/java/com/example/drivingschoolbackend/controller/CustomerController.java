package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.CustomerDto;
import com.example.drivingschoolbackend.dto.CustomerUpdateDto;
import com.example.drivingschoolbackend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        List<CustomerDto> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        CustomerDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDto> updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerUpdateDto customerUpdateDto
    ) {
        CustomerDto updatedCustomer = customerService.updateCustomer(id, customerUpdateDto);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
}
