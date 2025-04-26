package com.example.drivingschoolbackend.repository;

import com.example.drivingschoolbackend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);  // For login checks
    boolean existsByEmail(String email);       // For registration validation
}