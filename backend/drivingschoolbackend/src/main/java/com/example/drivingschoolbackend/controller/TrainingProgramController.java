package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.TrainingProgramDTO;
import com.example.drivingschoolbackend.service.TrainingProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-programs")
@RequiredArgsConstructor
public class TrainingProgramController {

    private final TrainingProgramService trainingProgramService;

    @GetMapping
    public ResponseEntity<List<TrainingProgramDTO.ResponseDTO>> getAllPrograms() {
        return ResponseEntity.ok(trainingProgramService.getAllPrograms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgramDTO.ResponseDTO> getProgramById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingProgramService.getProgramById(id));
    }
}