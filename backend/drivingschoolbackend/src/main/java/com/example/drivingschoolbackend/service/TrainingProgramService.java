package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.TrainingProgramDTO;
import com.example.drivingschoolbackend.entity.TrainingProgram;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.TrainingProgramRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingProgramService {

    private final TrainingProgramRepository trainingProgramRepository;

    public List<TrainingProgramDTO.ResponseDTO> getAllPrograms() {
        return trainingProgramRepository.findAllByOrderByIdDesc().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public TrainingProgramDTO.ResponseDTO getProgramById(Long id) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training program not found with id: " + id));
        return mapToResponseDTO(program);
    }

    @Transactional
    public TrainingProgramDTO.ResponseDTO createProgram(TrainingProgramDTO.CreateDTO dto) {
        // Create and save the training program
        TrainingProgram program = TrainingProgram.builder()
                .name(dto.getName())
                .licenseType(dto.getLicenseType())
                .duration(dto.getDuration())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .prerequisites(dto.getPrerequisites() != null ?
                        String.join(",", dto.getPrerequisites()) : "")
                .build();

        TrainingProgram savedProgram = trainingProgramRepository.save(program);
        return mapToResponseDTO(savedProgram);
    }

    @Transactional
    public TrainingProgramDTO.ResponseDTO updateProgram(Long id, TrainingProgramDTO.UpdateDTO dto) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training program not found with id: " + id));

        // Update the basic fields
        if (dto.getName() != null) program.setName(dto.getName());
        if (dto.getLicenseType() != null) program.setLicenseType(dto.getLicenseType());
        if (dto.getDuration() != null) program.setDuration(dto.getDuration());
        if (dto.getDescription() != null) program.setDescription(dto.getDescription());
        if (dto.getPrice() != null) program.setPrice(dto.getPrice());
        if (dto.getPrerequisites() != null) {
            program.setPrerequisites(String.join(",", dto.getPrerequisites()));
        }

        TrainingProgram updatedProgram = trainingProgramRepository.save(program);
        return mapToResponseDTO(updatedProgram);
    }

    @Transactional
    public void deleteProgram(Long id) {
        if (!trainingProgramRepository.existsById(id)) {
            throw new ResourceNotFoundException("Training program not found with id: " + id);
        }

        trainingProgramRepository.deleteById(id);
    }

    // Helper method to convert entity to DTO
    private TrainingProgramDTO.ResponseDTO mapToResponseDTO(TrainingProgram program) {
        List<String> prerequisites = new ArrayList<>();
        if (program.getPrerequisites() != null && !program.getPrerequisites().isEmpty()) {
            prerequisites = Arrays.asList(program.getPrerequisites().split(","));
        }

        return TrainingProgramDTO.ResponseDTO.builder()
                .id(program.getId())
                .name(program.getName())
                .licenseType(program.getLicenseType())
                .duration(program.getDuration())
                .description(program.getDescription())
                .price(program.getPrice())
                .prerequisites(prerequisites)
                .build();
    }
}