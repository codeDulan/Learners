package com.example.drivingschoolbackend.controller;

import com.example.drivingschoolbackend.dto.TrainingMaterialDTO;
import com.example.drivingschoolbackend.service.TrainingMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/staff/training-materials")
@RequiredArgsConstructor
public class TrainingMaterialAdminController {

    private final TrainingMaterialService trainingMaterialService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrainingMaterialDTO.ResponseDTO>> getAllMaterials() {
        return ResponseEntity.ok(trainingMaterialService.getAllMaterials());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingMaterialDTO.ResponseDTO> getMaterialById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingMaterialService.getMaterialById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingMaterialDTO.ResponseDTO> createMaterial(
            @RequestPart("material") @Valid TrainingMaterialDTO.CreateDTO dto,
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trainingMaterialService.createMaterial(dto, file));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainingMaterialDTO.ResponseDTO> updateMaterial(
            @PathVariable Long id,
            @RequestBody TrainingMaterialDTO.UpdateDTO dto
    ) {
        return ResponseEntity.ok(trainingMaterialService.updateMaterial(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) throws IOException {
        trainingMaterialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasRole('ADMIN')")
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