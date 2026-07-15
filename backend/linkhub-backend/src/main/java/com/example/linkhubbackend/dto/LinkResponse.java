package com.example.linkhubbackend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class LinkResponse {

    private Long id;

    private String originalUrl;

    private String shortUrl;

    private String shortCode;

    private String customAlias;

    private String title;

    private String description;

    private Long clickCount;

    private Boolean isActive;

    private LocalDateTime expirationDate;

    private LocalDateTime createdAt;

    private Boolean isFavorite;

    private Long categoryId;

    private String categoryName;

    private Boolean isPinned;

    private String notes;

}