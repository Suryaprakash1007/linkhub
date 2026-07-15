package com.example.linkhubbackend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class LinkCollectionResponse {

    private Long id;

    private String name;

    private String description;

    private Long totalLinks;

    private LocalDateTime createdAt;
}