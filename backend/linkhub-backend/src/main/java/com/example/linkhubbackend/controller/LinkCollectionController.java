package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.CreateCollectionRequest;
import com.example.linkhubbackend.dto.LinkCollectionResponse;
import com.example.linkhubbackend.dto.LinkResponse;
import com.example.linkhubbackend.dto.UpdateCollectionRequest;
import com.example.linkhubbackend.service.LinkCollectionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
public class LinkCollectionController {

    private final LinkCollectionService linkCollectionService;

    public LinkCollectionController(LinkCollectionService linkCollectionService) {
        this.linkCollectionService = linkCollectionService;
    }

    @PostMapping
    public ResponseEntity<LinkCollectionResponse> createCollection(
            @Valid @RequestBody CreateCollectionRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(linkCollectionService.createCollection(request));
    }

    @GetMapping
    public ResponseEntity<List<LinkCollectionResponse>> getMyCollections() {

        return ResponseEntity.ok(
                linkCollectionService.getMyCollections());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LinkCollectionResponse> updateCollection(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCollectionRequest request) {

        return ResponseEntity.ok(
                linkCollectionService.updateCollection(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(
            @PathVariable Long id) {

        linkCollectionService.deleteCollection(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{collectionId}/links")
    public ResponseEntity<List<LinkResponse>> getCollectionLinks(
            @PathVariable Long collectionId) {

        return ResponseEntity.ok(
                linkCollectionService.getCollectionLinks(collectionId));
    }
}