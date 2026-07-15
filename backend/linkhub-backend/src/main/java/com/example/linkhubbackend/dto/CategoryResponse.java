package com.example.linkhubbackend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CategoryResponse {

    private Long id;

    private String name;

    private LocalDateTime createdAt;

    private long totalLinks;
}