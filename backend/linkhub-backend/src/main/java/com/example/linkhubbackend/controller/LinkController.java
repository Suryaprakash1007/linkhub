package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.*;
import com.example.linkhubbackend.service.LinkCategoryService;
import com.example.linkhubbackend.service.LinkService;
import com.example.linkhubbackend.service.QRCodeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    private final QRCodeService qrCodeService;


    public LinkController(
            LinkService linkService,
            LinkCategoryService linkCategoryService,
            LinkTagService linkTagService,
            QRCodeService qrCodeService) {

        this.linkService = linkService;
        this.linkCategoryService = linkCategoryService;
        this.linkTagService = linkTagService;
        this.qrCodeService = qrCodeService;
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

        LinkResponse response = linkService.updateLink(id, request);

        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLink(@PathVariable Long id) {

        linkService.deleteLink(id);

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/search")
    public ResponseEntity<Page<LinkResponse>> searchLinks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(linkService.searchLinks(keyword, page, size, sort, direction));
    }

    @GetMapping("/filter/status")
    public ResponseEntity<Page<LinkResponse>> filterByStatus(
            @RequestParam Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(linkService.filterByStatus(active, page, size, sort, direction));
    }

    @GetMapping("/filter/expired")
    public ResponseEntity<Page<LinkResponse>> getExpiredLinks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(linkService.getExpiredLinks(page, size, sort, direction));
    }

    @GetMapping("/filter/non-expired")
    public ResponseEntity<Page<LinkResponse>> getNonExpiredLinks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(linkService.getNonExpiredLinks(page, size, sort, direction));
    }

    @GetMapping("/filter/custom-alias")
    public ResponseEntity<Page<LinkResponse>> getCustomAliasLinks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(linkService.getCustomAliasLinks(page, size, sort, direction));
    }

    @GetMapping("/filter/auto-generated")
    public ResponseEntity<Page<LinkResponse>> getAutoGeneratedLinks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(linkService.getAutoGeneratedLinks(page, size, sort, direction));
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
    public ResponseEntity<Page<LinkResponse>> getFavoriteLinks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(linkService.getFavoriteLinks(page, size, sort, direction));
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
    public ResponseEntity<Page<LinkResponse>> getPinnedLinks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(linkService.getPinnedLinks(page, size, sort, direction));
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

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> getQRCode(@PathVariable Long id) {
        try {
            LinkResponse link = linkService.getLinkById(id);
            byte[] qrImage = qrCodeService.generateQRCode(link.getShortUrl());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrImage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
