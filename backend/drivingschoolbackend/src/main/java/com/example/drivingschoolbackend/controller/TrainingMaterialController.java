package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.TrainingMaterialDTO;
import com.example.drivingschoolbackend.service.TrainingMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/training-materials")
@RequiredArgsConstructor
public class TrainingMaterialController {

    private final TrainingMaterialService trainingMaterialService;

    // Get materials by license type - accessible to customers and staff
    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<List<TrainingMaterialDTO.ResponseDTO>> getMaterialsByLicenseType(
            @RequestParam(required = false, defaultValue = "All") String licenseType
    ) {
        return ResponseEntity.ok(trainingMaterialService.getMaterialsByLicenseType(licenseType));
    }

    // Get material by ID - accessible to customers and staff
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<TrainingMaterialDTO.ResponseDTO> getMaterialById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingMaterialService.getMaterialById(id));
    }

    // Download material - accessible to customers and staff
    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'WORKER', 'INSTRUCTOR')")
    public ResponseEntity<byte[]> downloadMaterial(@PathVariable Long id) throws IOException {
        TrainingMaterialDTO.ResponseDTO material = trainingMaterialService.getMaterialById(id);
        byte[] fileData = trainingMaterialService.getFileData(id);

        // Increment download count
        trainingMaterialService.incrementDownloadCount(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(material.getFileType()))
                .header("Content-Disposition", "attachment; filename=\"" + material.getName() + "\"")
                .body(fileData);
    }
}