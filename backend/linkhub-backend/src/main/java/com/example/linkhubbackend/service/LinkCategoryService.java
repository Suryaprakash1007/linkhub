package com.example.linkhubbackend.service;

import com.example.linkhubbackend.dto.LinkResponse;
import com.example.linkhubbackend.entity.Category;
import com.example.linkhubbackend.entity.Link;
import com.example.linkhubbackend.entity.User;
import com.example.linkhubbackend.repository.LinkRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LinkCategoryService {

    private final LinkRepository linkRepository;
    private final CategoryService categoryService;
    private final UserService userService;

    public LinkCategoryService(LinkRepository linkRepository,
                               CategoryService categoryService,
                               UserService userService) {

        this.linkRepository = linkRepository;
        this.categoryService = categoryService;
        this.userService = userService;
    }
    public LinkResponse assignCategory(Long linkId, Long categoryId) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(linkId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found."));

        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only modify your own links.");
        }

        Category category =
                categoryService.getCategoryForCurrentUser(categoryId);

        link.setCategory(category);

        Link saved = linkRepository.save(link);

        return mapToResponse(saved);
    }
    public LinkResponse removeCategory(Long linkId) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(linkId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found."));

        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only modify your own links.");
        }

        link.setCategory(null);

        Link saved = linkRepository.save(link);

        return mapToResponse(saved);
    }
    public List<LinkResponse> getLinksByCategory(Long categoryId) {

        Category category =
                categoryService.getCategoryForCurrentUser(categoryId);

        return linkRepository
                .findByCategoryOrderByCreatedAtDesc(category)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    private LinkResponse mapToResponse(Link link) {

        return LinkResponse.builder()
                .id(link.getId())
                .title(link.getTitle())
                .originalUrl(link.getOriginalUrl())
                .shortCode(link.getShortCode())
                .customAlias(link.getCustomAlias())
                .clickCount(link.getClickCount())
                .isActive(link.getIsActive())
                .isFavorite(link.getIsFavorite())
                .categoryId(
                        link.getCategory() != null ? link.getCategory().getId() : null
                )
                .categoryName(
                        link.getCategory() != null ? link.getCategory().getName() : null
                )
                .expirationDate(link.getExpirationDate())
                .createdAt(link.getCreatedAt())
                .build();
    }
}