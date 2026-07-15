package com.example.linkhubbackend.mapper;

import com.example.linkhubbackend.dto.LinkResponse;
import com.example.linkhubbackend.entity.Link;
import org.springframework.stereotype.Component;

@Component
public class LinkMapper {
    public LinkResponse toResponse(Link link) {
        return LinkResponse.builder()
                .id(link.getId())
                .title(link.getTitle())
                .originalUrl(link.getOriginalUrl())
                .shortCode(link.getShortCode())
                .shortUrl("http://localhost:8080/" + link.getShortCode())
                .customAlias(link.getCustomAlias())
                .description(link.getDescription())
                .clickCount(link.getClickCount())
                .isActive(link.getIsActive())
                .isFavorite(link.getIsFavorite())
                .isPinned(link.getIsPinned())
                .notes(link.getNotes())
                .expirationDate(link.getExpirationDate())
                .createdAt(link.getCreatedAt())
                .categoryId(
                        link.getCategory() != null ? link.getCategory().getId() : null
                )
                .categoryName(
                        link.getCategory() != null ? link.getCategory().getName() : null
                )
                .build();

    }
}