package com.example.linkhubbackend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TagResponse {

    private Long id;

    private String name;

    private String description;

    private Long totalLinks;
}
