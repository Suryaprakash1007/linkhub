package com.example.linkhubbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class LinkhubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LinkhubBackendApplication.class, args);
    }

}
