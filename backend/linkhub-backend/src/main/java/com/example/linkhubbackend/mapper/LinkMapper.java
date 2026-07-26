package com.example.linkhubbackend.mapper;

import com.example.linkhubbackend.dto.LinkResponse;
import com.example.linkhubbackend.entity.Link;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class LinkMapper {

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public LinkResponse toResponse(Link link) {
        return LinkResponse.builder()
                .id(link.getId())
                .title(link.getTitle())
                .originalUrl(link.getOriginalUrl())
                .shortCode(link.getShortCode())
                .shortUrl(baseUrl + "/r/" + link.getShortCode())
                .customAlias(link.getCustomAlias())
                .description(link.getDescription())
                .clickCount(link.getClickCount())
                .isActive(link.getIsActive())
                .isFavorite(link.getIsFavorite())
                .isPinned(link.getIsPinned())
                .notes(link.getNotes())
                .password(link.getPassword() != null && !link.getPassword().isBlank())
                .expirationDate(link.getExpirationDate())
                .createdAt(link.getCreatedAt())
                .categoryId(
                        link.getCategory() != null ? link.getCategory().getId() : null
                )
                .categoryName(
                        link.getCategory() != null ? link.getCategory().getName() : null
                )
                .tags(
                        link.getTags() != null
                                ? link.getTags().stream()
                                .map(tag -> tag.getName())
                                .collect(java.util.stream.Collectors.toSet())
                                : java.util.Set.of()
                )
                .collections(
                        link.getCollections() != null
                                ? link.getCollections().stream()
                                .map(col -> col.getName())
                                .collect(java.util.stream.Collectors.toSet())
                                : java.util.Set.of()
                )
                .build();

    }
}
