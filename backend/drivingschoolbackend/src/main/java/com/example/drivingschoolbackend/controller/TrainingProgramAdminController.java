package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.TrainingProgramDTO;
import com.example.drivingschoolbackend.service.TrainingProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/training-programs")
@RequiredArgsConstructor
public class TrainingProgramAdminController {

    private final TrainingProgramService trainingProgramService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrainingProgramDTO.ResponseDTO>> getAllPrograms() {
        return ResponseEntity.ok(trainingProgramService.getAllPrograms());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingProgramDTO.ResponseDTO> getProgramById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingProgramService.getProgramById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingProgramDTO.ResponseDTO> createProgram(
            @Valid @RequestBody TrainingProgramDTO.CreateDTO dto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trainingProgramService.createProgram(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingProgramDTO.ResponseDTO> updateProgram(
            @PathVariable Long id,
            @RequestBody TrainingProgramDTO.UpdateDTO dto
    ) {
        return ResponseEntity.ok(trainingProgramService.updateProgram(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        trainingProgramService.deleteProgram(id);
        return ResponseEntity.noContent().build();
    }
}