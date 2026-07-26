package com.example.linkhubbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicProfileResponse {
    private String fullName;
    private String username;
    private String bio;
    private String profilePicture;
    private String college;
    private String department;
    private String location;
}
