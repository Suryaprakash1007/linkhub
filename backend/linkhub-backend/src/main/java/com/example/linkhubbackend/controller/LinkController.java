package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.*;
import com.example.linkhubbackend.service.LinkCategoryService;
import com.example.linkhubbackend.service.LinkService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import com.example.linkhubbackend.service.LinkTagService;
import org.springframework.data.domain.Page;
import java.util.List;
import jakarta.servlet.http.HttpServletRequest;
import com.example.linkhubbackend.dto.LinkPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
@RestController
@RequestMapping("/api/links")
@Tag(
        name = "Link Management",
        description = "Operations for managing short links"
)
public class LinkController {

    private final LinkService linkService;

    private final LinkCategoryService linkCategoryService;

    private final LinkTagService linkTagService;



    public LinkController(
            LinkService linkService,
            LinkCategoryService linkCategoryService,
            LinkTagService linkTagService) {

        this.linkService = linkService;
        this.linkCategoryService = linkCategoryService;
        this.linkTagService = linkTagService;
    }



    @Operation(
            summary = "Create Short Link",
            description = "Creates a new short URL for the authenticated user."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Link created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<LinkResponse> createLink(
            @Valid @RequestBody CreateLinkRequest request) {

        LinkResponse response = linkService.createLink(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @Operation(
            summary = "Redirect Link",
            description = "Redirects a short code to its original URL."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "302", description = "Redirect successful"),
            @ApiResponse(responseCode = "404", description = "Link not found")
    })
    @GetMapping("/{code}")
    public RedirectView redirect(
            @PathVariable String code,
            HttpServletRequest request) {

        String url = linkService.redirect(code, request);

        return new RedirectView(url);
    }
    @GetMapping
    public ResponseEntity<Page<LinkResponse>> getMyLinks(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "createdAt")
            String sort,

            @RequestParam(defaultValue = "desc")
            String direction) {

        return ResponseEntity.ok(
                linkService.getMyLinks(
                        page,
                        size,
                        sort,
                        direction));
    }
    @PutMapping("/{id}")
    public ResponseEntity<LinkResponse> updateLink(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLinkRequest request) {
        System.out.println("SERVICE START");

        System.out.println("BEFORE SERVICE");

        LinkResponse response = linkService.updateLink(id, request);

        System.out.println("AFTER SERVICE");

        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLink(@PathVariable Long id) {

        linkService.deleteLink(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/search")
    public ResponseEntity<List<LinkResponse>> searchLinks(
            @RequestParam String keyword) {

        return ResponseEntity.ok(linkService.searchLinks(keyword));
    }
    @GetMapping("/filter/status")
    public ResponseEntity<List<LinkResponse>> filterByStatus(
            @RequestParam Boolean active) {

        return ResponseEntity.ok(linkService.filterByStatus(active));
    }
    @GetMapping("/filter/expired")
    public ResponseEntity<List<LinkResponse>> getExpiredLinks() {

        return ResponseEntity.ok(linkService.getExpiredLinks());
    }
    @GetMapping("/filter/non-expired")
    public ResponseEntity<List<LinkResponse>> getNonExpiredLinks() {

        return ResponseEntity.ok(linkService.getNonExpiredLinks());
    }
    @GetMapping("/filter/custom-alias")
    public ResponseEntity<List<LinkResponse>> getCustomAliasLinks() {

        return ResponseEntity.ok(linkService.getCustomAliasLinks());
    }
    @GetMapping("/filter/auto-generated")
    public ResponseEntity<List<LinkResponse>> getAutoGeneratedLinks() {

        return ResponseEntity.ok(linkService.getAutoGeneratedLinks());
    }
    @PutMapping("/{id}/favorite")
    public ResponseEntity<String> markAsFavorite(@PathVariable Long id) {

        linkService.markAsFavorite(id);

        return ResponseEntity.ok("Link marked as favorite.");
    }
    @PutMapping("/{id}/unfavorite")
    public ResponseEntity<String> removeFavorite(@PathVariable Long id) {

        linkService.removeFavorite(id);

        return ResponseEntity.ok("Link removed from favorites.");
    }
    @GetMapping("/favorites")
    public ResponseEntity<List<LinkResponse>> getFavoriteLinks() {

        return ResponseEntity.ok(linkService.getFavoriteLinks());
    }
    @PutMapping("/{linkId}/category/{categoryId}")
    public ResponseEntity<LinkResponse> assignCategory(
            @PathVariable Long linkId,
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                linkCategoryService.assignCategory(linkId, categoryId));
    }
    @DeleteMapping("/{linkId}/category")
    public ResponseEntity<LinkResponse> removeCategory(
            @PathVariable Long linkId) {

        return ResponseEntity.ok(
                linkCategoryService.removeCategory(linkId));
    }
    @GetMapping("/{categoryId}/links")
    public ResponseEntity<List<LinkResponse>> getLinksByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                linkCategoryService.getLinksByCategory(categoryId));
    }
    @PutMapping("/{linkId}/tags/{tagId}")
    public ResponseEntity<LinkResponse> assignTag(
            @PathVariable Long linkId,
            @PathVariable Long tagId) {

        return ResponseEntity.ok(
                linkTagService.assignTag(linkId, tagId));
    }
    @DeleteMapping("/{linkId}/tags/{tagId}")
    public ResponseEntity<LinkResponse> removeTag(
            @PathVariable Long linkId,
            @PathVariable Long tagId) {

        return ResponseEntity.ok(
                linkTagService.removeTag(linkId, tagId));
    }
    @GetMapping("/{linkId}/tags")
    public ResponseEntity<List<TagResponse>> getTagsOfLink(
            @PathVariable Long linkId) {

        return ResponseEntity.ok(
                linkTagService.getTagsOfLink(linkId));
    }
    @PutMapping("/{id}/pin")
    public ResponseEntity<Void> pinLink(@PathVariable Long id) {

        linkService.pinLink(id);

        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/{id}/pin")
    public ResponseEntity<Void> unpinLink(@PathVariable Long id) {

        linkService.unpinLink(id);

        return ResponseEntity.ok().build();
    }
    @GetMapping("/pinned")
    public ResponseEntity<List<LinkResponse>> getPinnedLinks() {

        return ResponseEntity.ok(
                linkService.getPinnedLinks());
    }
    @GetMapping("/dashboard")
    public DashboardResponse getDashboard() {
        return linkService.getDashboard();
    }
    @PostMapping("/{code}/verify-password")
    public ResponseEntity<String> verifyPassword(
            @PathVariable String code,
            @RequestBody LinkPasswordRequest request) {

        boolean valid = linkService.verifyPassword(
                code,
                request.getPassword());

        if (!valid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password");
        }

        return ResponseEntity.ok("Password verified");
    }
    @GetMapping("/{id}/history")
    public ResponseEntity<List<ClickHistoryResponse>> getHistory(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                linkService.getClickHistory(id));
    }

}