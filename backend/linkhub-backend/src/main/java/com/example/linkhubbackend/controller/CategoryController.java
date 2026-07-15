package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.*;
import com.example.linkhubbackend.service.CategoryService;
import com.example.linkhubbackend.service.LinkCategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final LinkCategoryService linkCategoryService;

    public CategoryController(CategoryService categoryService,
                              LinkCategoryService linkCategoryService) {

        this.categoryService = categoryService;
        this.linkCategoryService = linkCategoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getMyCategories() {

        return ResponseEntity.ok(categoryService.getMyCategories());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request) {

        return ResponseEntity.ok(
                categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{categoryId}/links")
    public ResponseEntity<List<LinkResponse>> getLinksByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                linkCategoryService.getLinksByCategory(categoryId));
    }
}