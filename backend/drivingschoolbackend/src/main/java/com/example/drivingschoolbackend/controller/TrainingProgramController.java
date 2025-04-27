package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.TrainingProgramDTO;
import com.example.drivingschoolbackend.service.TrainingProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-programs")
@RequiredArgsConstructor
public class TrainingProgramController {

    private final TrainingProgramService trainingProgramService;

    // Get all programs - accessible to everyone (public endpoint)
    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<TrainingProgramDTO.ResponseDTO>> getAllPrograms() {
        return ResponseEntity.ok(trainingProgramService.getAllPrograms());
    }

    // Get program by ID - accessible to everyone (public endpoint)
    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<TrainingProgramDTO.ResponseDTO> getProgramById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingProgramService.getProgramById(id));
    }
}