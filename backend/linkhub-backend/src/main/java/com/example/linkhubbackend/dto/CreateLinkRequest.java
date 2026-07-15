package com.example.linkhubbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateLinkRequest {

    @NotBlank(message = "Original URL is required")
    private String originalUrl;

    @Size(max = 100)
    private String title;

    @Size(max = 255)
    private String description;

    @Size(max = 100)
    private String customAlias;

    @Size(max = 500)
    private String notes;

    @Size(min = 4, max = 50)
    private String password;

}