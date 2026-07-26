package com.example.linkhubbackend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Set;

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

    private Boolean isPinned;

    private Long categoryId;

    private String categoryName;

    private String notes;

    private Boolean password;

    private Set<String> tags;

    private Set<String> collections;

}
