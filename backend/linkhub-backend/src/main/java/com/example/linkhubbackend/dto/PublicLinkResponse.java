package com.example.linkhubbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PublicLinkResponse {

    private String title;

    private boolean passwordProtected;

    private boolean expired;

    private boolean active;
}