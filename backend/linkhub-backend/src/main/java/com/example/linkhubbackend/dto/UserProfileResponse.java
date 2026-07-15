package com.example.linkhubbackend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private String bio;

    private String profilePicture;

    private String college;

    private String department;

    private String location;
}
