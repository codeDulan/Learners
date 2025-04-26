package com.example.drivingschoolbackend.service;

import com.example.drivingschoolbackend.dto.TrainingMaterialDTO;
import com.example.drivingschoolbackend.entity.TrainingMaterial;
import com.example.drivingschoolbackend.exception.ResourceNotFoundException;
import com.example.drivingschoolbackend.repository.TrainingMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingMaterialService {

    private final TrainingMaterialRepository trainingMaterialRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public List<TrainingMaterialDTO.ResponseDTO> getAllMaterials() {
        return trainingMaterialRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<TrainingMaterialDTO.ResponseDTO> getMaterialsByLicenseType(String licenseType) {
        return trainingMaterialRepository.findByForLicenseTypeOrForLicenseType(licenseType, "All").stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public TrainingMaterialDTO.ResponseDTO getMaterialById(Long id) {
        TrainingMaterial material = trainingMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training material not found with id: " + id));
        return mapToResponseDTO(material);
    }

    public TrainingMaterialDTO.ResponseDTO createMaterial(TrainingMaterialDTO.CreateDTO dto, MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String fileType = file.getContentType();

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file to the file system
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        // Get current user from security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        TrainingMaterial material = TrainingMaterial.builder()
                .name(dto.getName())
                .fileName(fileName)
                .fileType(fileType)
                .category(dto.getCategory())
                .description(dto.getDescription())
                .filePath(filePath.toString())
                .fileSize(file.getSize())
                .forLicenseType(dto.getForLicenseType())
                .visibility(dto.getVisibility())
                .downloadCount(0)
                .uploadDate(LocalDateTime.now())
                .uploadedBy(username)
                .build();

        TrainingMaterial savedMaterial = trainingMaterialRepository.save(material);
        return mapToResponseDTO(savedMaterial);
    }

    public TrainingMaterialDTO.ResponseDTO updateMaterial(Long id, TrainingMaterialDTO.UpdateDTO dto) {
        TrainingMaterial material = trainingMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training material not found with id: " + id));

        if (dto.getName() != null) {
            material.setName(dto.getName());
        }
        if (dto.getCategory() != null) {
            material.setCategory(dto.getCategory());
        }
        if (dto.getDescription() != null) {
            material.setDescription(dto.getDescription());
        }
        if (dto.getForLicenseType() != null) {
            material.setForLicenseType(dto.getForLicenseType());
        }
        if (dto.getVisibility() != null) {
            material.setVisibility(dto.getVisibility());
        }

        TrainingMaterial updatedMaterial = trainingMaterialRepository.save(material);
        return mapToResponseDTO(updatedMaterial);
    }

    public void deleteMaterial(Long id) throws IOException {
        TrainingMaterial material = trainingMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training material not found with id: " + id));

        // Delete file from filesystem
        Path filePath = Paths.get(material.getFilePath());
        Files.deleteIfExists(filePath);

        // Delete from database
        trainingMaterialRepository.delete(material);
    }

    public void incrementDownloadCount(Long id) {
        TrainingMaterial material = trainingMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training material not found with id: " + id));

        material.setDownloadCount(material.getDownloadCount() + 1);
        trainingMaterialRepository.save(material);
    }

    public byte[] getFileData(Long id) throws IOException {
        TrainingMaterial material = trainingMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training material not found with id: " + id));

        Path filePath = Paths.get(material.getFilePath());
        return Files.readAllBytes(filePath);
    }

    private TrainingMaterialDTO.ResponseDTO mapToResponseDTO(TrainingMaterial material) {
        return TrainingMaterialDTO.ResponseDTO.builder()
                .id(material.getId())
                .name(material.getName())
                .fileType(material.getFileType())
                .category(material.getCategory())
                .description(material.getDescription())
                .fileSize(material.getFileSize())
                .forLicenseType(material.getForLicenseType())
                .visibility(material.getVisibility())
                .downloadCount(material.getDownloadCount())
                .uploadDate(material.getUploadDate())
                .uploadedBy(material.getUploadedBy())
                .build();
    }
}