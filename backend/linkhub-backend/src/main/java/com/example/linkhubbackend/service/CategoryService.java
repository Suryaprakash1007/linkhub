package com.example.linkhubbackend.service;

import com.example.linkhubbackend.dto.*;
import com.example.linkhubbackend.entity.Category;
import com.example.linkhubbackend.entity.User;
import com.example.linkhubbackend.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public CategoryService(CategoryRepository categoryRepository,
                           UserService userService) {
        this.categoryRepository = categoryRepository;
        this.userService = userService;
    }
    public CategoryResponse createCategory(CreateCategoryRequest request) {

        User currentUser = userService.getCurrentUser();

        if (categoryRepository.existsByUserAndName(currentUser, request.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Category already exists.");
        }

        Category category = Category.builder()
                .name(request.getName())
                .user(currentUser)
                .build();

        Category saved = categoryRepository.save(category);

        return mapToResponse(saved);
    }
    private CategoryResponse mapToResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .createdAt(category.getCreatedAt())
                .totalLinks(
                        category.getLinks() == null
                                ? 0
                                : category.getLinks().size()
                )
                .build();
    }
    public List<CategoryResponse> getMyCategories() {

        User currentUser = userService.getCurrentUser();

        return categoryRepository
                .findByUserOrderByNameAsc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    public CategoryResponse updateCategory(Long id,
                                           UpdateCategoryRequest request) {

        User currentUser = userService.getCurrentUser();

        Category category = categoryRepository
                .findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found."));

        if (!category.getName().equalsIgnoreCase(request.getName())
                && categoryRepository.existsByUserAndName(currentUser, request.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Category already exists.");
        }

        category.setName(request.getName());

        Category updated = categoryRepository.save(category);

        return mapToResponse(updated);
    }
    @org.springframework.transaction.annotation.Transactional
    public void deleteCategory(Long id) {

        User currentUser = userService.getCurrentUser();

        Category category = categoryRepository
                .findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found."));

        if (category.getLinks() != null) {
            for (com.example.linkhubbackend.entity.Link link : category.getLinks()) {
                link.setCategory(null);
            }
        }

        categoryRepository.delete(category);
    }
    public Category getCategoryForCurrentUser(Long categoryId) {

        User currentUser = userService.getCurrentUser();

        return categoryRepository
                .findByIdAndUser(categoryId, currentUser)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Category not found."));
    }
}