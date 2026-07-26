package com.example.linkhubbackend.dto;


import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @Size(max = 100)
    private String fullName;

    @Size(max = 100)
    private String username;

    @Size(max = 255)
    private String bio;

    @Size(max = 255)
    private String profilePicture;

    @Size(max = 100)
    private String college;

    @Size(max = 100)
    private String department;

    @Size(max = 100)
    private String location;
}
