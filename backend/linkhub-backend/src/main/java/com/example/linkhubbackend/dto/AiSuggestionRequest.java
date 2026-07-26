package com.example.linkhubbackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiSuggestionRequest {
    @NotBlank(message = "URL is required")
    private String url;
}
