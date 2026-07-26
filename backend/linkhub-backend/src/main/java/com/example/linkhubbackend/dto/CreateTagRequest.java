package com.example.linkhubbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTagRequest {

    @NotBlank(message = "Tag name is required.")
    @Size(max = 50)
    private String name;

    private String description;
}
