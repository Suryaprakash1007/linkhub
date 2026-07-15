package com.example.linkhubbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateLinkRequest {

    @Size(max = 100)
    private String title;

    @NotBlank(message = "Original URL is required")
    private String originalUrl;

    @Size(max = 100)
    private String customAlias;

    private LocalDateTime expirationDate;

    private Boolean isActive;

    @Size(max = 500)
    private String notes;
}