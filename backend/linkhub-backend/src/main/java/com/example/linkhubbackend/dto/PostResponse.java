package com.example.linkhubbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String content;
    private String imageUrl;

    private Long userId;
    private String fullName;

    private LocalDateTime createdAt;
    private long likeCount;
}