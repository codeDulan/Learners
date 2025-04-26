package com.example.drivingschoolbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SessionNotAvailableException extends RuntimeException {
    public SessionNotAvailableException(String message) {
        super(message);
    }
}