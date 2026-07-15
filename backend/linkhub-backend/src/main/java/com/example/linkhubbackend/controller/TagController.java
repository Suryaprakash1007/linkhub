package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.CreateTagRequest;
import com.example.linkhubbackend.dto.LinkResponse;
import com.example.linkhubbackend.dto.TagResponse;
import com.example.linkhubbackend.dto.UpdateTagRequest;
import com.example.linkhubbackend.service.LinkTagService;
import com.example.linkhubbackend.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    private final LinkTagService linkTagService;

    public TagController(TagService tagService,
                         LinkTagService linkTagService) {

        this.tagService = tagService;
        this.linkTagService = linkTagService;
    }

    @PostMapping
    public ResponseEntity<TagResponse> createTag(
            @Valid @RequestBody CreateTagRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tagService.createTag(request));
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> getMyTags() {

        return ResponseEntity.ok(tagService.getMyTags());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagResponse> updateTag(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTagRequest request) {

        return ResponseEntity.ok(
                tagService.updateTag(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(
            @PathVariable Long id) {

        tagService.deleteTag(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{tagId}/links")
    public ResponseEntity<List<LinkResponse>> getLinksByTag(
            @PathVariable Long tagId) {

        return ResponseEntity.ok(
                linkTagService.getLinksByTag(tagId));
    }
}