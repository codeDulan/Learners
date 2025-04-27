package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.StaffInfoDto;
import com.example.drivingschoolbackend.entity.Users;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository staffRepository;

    public StaffInfoDto getCurrentStaffInfo(Long staffId) {
        Users staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found"));

        return StaffInfoDto.fromEntity(staff);
    }
}