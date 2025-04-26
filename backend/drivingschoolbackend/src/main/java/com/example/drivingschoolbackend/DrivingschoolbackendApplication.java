package com.example.drivingschoolbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DrivingschoolbackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DrivingschoolbackendApplication.class, args);
	}

}
