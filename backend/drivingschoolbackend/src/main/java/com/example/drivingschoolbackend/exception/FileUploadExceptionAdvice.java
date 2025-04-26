package com.example.drivingschoolbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.IOException;

@ControllerAdvice
public class FileUploadExceptionAdvice {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body("File too large! Maximum allowed size exceeded.");
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException exc) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing the file: " + exc.getMessage());
    }
}