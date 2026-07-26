package com.example.linkhubbackend.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.linkhubbackend.dto.*;
import com.example.linkhubbackend.entity.Link;
import com.example.linkhubbackend.entity.User;
import com.example.linkhubbackend.repository.LinkRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.linkhubbackend.mapper.LinkMapper;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class LinkService {

    private static final Logger log =
            LoggerFactory.getLogger(LinkService.class);

    private final LinkRepository linkRepository;

    private final UserService userService;

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final SecureRandom RANDOM = new SecureRandom();

    private final LinkMapper linkMapper;

    private final ClickAnalyticsService clickAnalyticsService;

    private final PasswordEncoder passwordEncoder;

    public LinkService(
            LinkRepository linkRepository,
            UserService userService,
            LinkMapper linkMapper,
            ClickAnalyticsService clickAnalyticsService,
            PasswordEncoder passwordEncoder) {

        this.linkRepository = linkRepository;
        this.userService = userService;
        this.linkMapper = linkMapper;
        this.clickAnalyticsService = clickAnalyticsService;
        this.passwordEncoder = passwordEncoder;
    }

    private String generateShortCode() {

        String shortCode;

        do {

            StringBuilder builder = new StringBuilder();

            for (int i = 0; i < 6; i++) {
                builder.append(
                        CHARACTERS.charAt(
                                RANDOM.nextInt(CHARACTERS.length())
                        )
                );
            }

            shortCode = builder.toString();

        } while (linkRepository.existsByShortCode(shortCode));

        return shortCode;
    }
    private boolean isValidUrl(String url) {

        return url.startsWith("http://")
                || url.startsWith("https://");
    }
    public LinkResponse createLink(CreateLinkRequest request) {

        User currentUser = userService.getCurrentUser();

        if (!isValidUrl(request.getOriginalUrl())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid URL");
        }

        String shortCode;

        if (request.getCustomAlias() != null &&
                !request.getCustomAlias().isBlank()) {

            if (linkRepository.existsByCustomAlias(request.getCustomAlias())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Custom alias already exists");
            }

            shortCode = request.getCustomAlias();

        } else {

            shortCode = generateShortCode();
        }

        Link link = Link.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .customAlias(request.getCustomAlias())
                .title(request.getTitle())
                .description(request.getDescription())
                .notes(request.getNotes())
                .user(currentUser)
                .build();

        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            link.setPassword(
                    passwordEncoder.encode(request.getPassword()));
        }

        Link savedLink = linkRepository.save(link);

        return linkMapper.toResponse(savedLink);
    }
    public String redirect(String code, HttpServletRequest request) {

        log.info("Received redirect request for code: {}", code);
        Link link = linkRepository
                .findByShortCodeOrCustomAlias(code, code)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found"));

        if (!link.getIsActive()) {
            throw new ResponseStatusException(
                    HttpStatus.GONE,
                    "This link has been disabled.");
        }

        if (link.getExpirationDate() != null &&
                link.getExpirationDate().isBefore(LocalDateTime.now())) {

            throw new ResponseStatusException(
                    HttpStatus.GONE,
                    "This link has expired.");
        }

        log.info("Redirecting to: {}", link.getOriginalUrl());

        link.setClickCount(link.getClickCount() + 1);
        linkRepository.save(link);

        clickAnalyticsService.recordClick(link, request);

        return link.getOriginalUrl();
    }
    public Page<LinkResponse> getMyLinks(
            int page,
            int size,
            String sortBy,
            String direction) {

        User currentUser = userService.getCurrentUser();

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(page, size, sort);

        Page<Link> links =
                linkRepository.findByUser(currentUser, pageable);

        return links.map(linkMapper::toResponse);
    }
    public LinkResponse updateLink(Long id, UpdateLinkRequest request) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found"));
        log.debug("Current User ID: {}", currentUser.getId());
        log.debug("Link Owner ID: {}", link.getUser().getId());
        log.debug("Current User Email: {}", currentUser.getEmail());
        log.debug("Link Owner Email: {}", link.getUser().getEmail());
        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only update your own links.");
        }
        if (request.getNotes() != null) {
            link.setNotes(request.getNotes());
        }

        if (request.getTitle() != null) {
            link.setTitle(request.getTitle());
        }

        if (request.getOriginalUrl() != null &&
                !request.getOriginalUrl().isBlank()) {
            link.setOriginalUrl(request.getOriginalUrl());
        }
        if (request.getCustomAlias() != null &&
                !request.getCustomAlias().isBlank()) {

            Optional<Link> existing =
                    linkRepository.findByCustomAlias(request.getCustomAlias());

            if (existing.isPresent() &&
                    !existing.get().getId().equals(link.getId())) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Custom alias already exists.");
            }

            link.setCustomAlias(request.getCustomAlias());
        }
        if (request.getExpirationDate() != null) {
            link.setExpirationDate(request.getExpirationDate());
        }
        if (request.getIsActive() != null) {
            link.setIsActive(request.getIsActive());
        }

        Link updatedLink = linkRepository.save(link);

        return linkMapper.toResponse(updatedLink);
    }
    public void deleteLink(Long id) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found"));

        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only delete your own links.");
        }

        linkRepository.delete(link);
    }
    public Page<LinkResponse> filterByStatus(Boolean isActive, int page, int size, String sortBy, String direction) {
        User currentUser = userService.getCurrentUser();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Link> links = linkRepository.findByUserAndIsActiveOrderByCreatedAtDesc(currentUser, isActive, pageable);
        return links.map(linkMapper::toResponse);
    }
    public Page<LinkResponse> getExpiredLinks(int page, int size, String sortBy, String direction) {
        User currentUser = userService.getCurrentUser();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Link> links = linkRepository.findByUserAndExpirationDateBeforeOrderByCreatedAtDesc(currentUser, LocalDateTime.now(), pageable);
        return links.map(linkMapper::toResponse);
    }
    public Page<LinkResponse> getNonExpiredLinks(int page, int size, String sortBy, String direction) {
        User currentUser = userService.getCurrentUser();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Link> links = linkRepository.findByUserAndExpirationDateAfterOrderByCreatedAtDesc(currentUser, LocalDateTime.now(), pageable);
        return links.map(linkMapper::toResponse);
    }
    public Page<LinkResponse> getCustomAliasLinks(int page, int size, String sortBy, String direction) {
        User currentUser = userService.getCurrentUser();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Link> links = linkRepository.findByUserAndCustomAliasIsNotNullOrderByCreatedAtDesc(currentUser, pageable);
        return links.map(linkMapper::toResponse);
    }
    public Page<LinkResponse> getAutoGeneratedLinks(int page, int size, String sortBy, String direction) {
        User currentUser = userService.getCurrentUser();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Link> links = linkRepository.findByUserAndCustomAliasIsNullOrderByCreatedAtDesc(currentUser, pageable);
        return links.map(linkMapper::toResponse);
    }

    public void markAsFavorite(Long id) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found"));

        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only modify your own links.");
        }

        link.setIsFavorite(true);

        linkRepository.save(link);
    }
    public void removeFavorite(Long id) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found"));

        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only modify your own links.");
        }

        link.setIsFavorite(false);

        linkRepository.save(link);
    }
    public Page<LinkResponse> getFavoriteLinks(int page, int size, String sortBy, String direction) {
        User currentUser = userService.getCurrentUser();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Link> links = linkRepository.findByUserAndIsFavoriteTrueOrderByCreatedAtDesc(currentUser, pageable);
        return links.map(linkMapper::toResponse);
    }
    public void pinLink(Long id) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found."));

        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only modify your own links.");
        }

        link.setIsPinned(true);

        linkRepository.save(link);
    }
    public void unpinLink(Long id) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found."));

        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only modify your own links.");
        }

        link.setIsPinned(false);

        linkRepository.save(link);
    }
    public Page<LinkResponse> getPinnedLinks(int page, int size, String sortBy, String direction) {
        User currentUser = userService.getCurrentUser();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Link> links = linkRepository.findByUserAndIsPinnedTrueOrderByCreatedAtDesc(currentUser, pageable);
        return links.map(linkMapper::toResponse);
    }
    public DashboardResponse getDashboard() {

        User currentUser = userService.getCurrentUser();

        DashboardResponse response = new DashboardResponse();

        // Total Links
        response.setTotalLinks(
                linkRepository.countByUser(currentUser)
        );

        // Active Links
        response.setActiveLinks(
                linkRepository.countByUserAndIsActiveTrue(currentUser)
        );

        // Favorite Links
        response.setFavoriteLinks(
                linkRepository.countByUserAndIsFavoriteTrue(currentUser)
        );

        // Pinned Links
        response.setPinnedLinks(
                linkRepository.countByUserAndIsPinnedTrue(currentUser)
        );

        // Get all user's links ordered by click count
        List<Link> links =
                linkRepository.findByUserOrderByClickCountDesc(currentUser);

        long totalClicks = 0;
        long expiredLinks = 0;

        for (Link link : links) {

            totalClicks += link.getClickCount();

            if (link.getExpirationDate() != null &&
                    link.getExpirationDate().isBefore(LocalDateTime.now())) {

                expiredLinks++;
            }
        }

        response.setTotalClicks(totalClicks);
        response.setExpiredLinks(expiredLinks);

        // Most Clicked Link
        if (!links.isEmpty()) {

            Link topLink = links.getFirst();

            response.setMostClickedTitle(topLink.getTitle());

            response.setMostClickedCount(topLink.getClickCount());
        }

        return response;
    }
    public Page<LinkResponse> searchLinks(String keyword, int page, int size, String sortBy, String direction) {
        User currentUser = userService.getCurrentUser();
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Link> links = linkRepository.searchLinks(currentUser, keyword, pageable);
        return links.map(linkMapper::toResponse);
    }
    public boolean verifyPassword(String code, String password) {

        Link link = linkRepository.findByShortCode(code)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found"));

        if (link.getPassword() == null) {
            return true;
        }

        return passwordEncoder.matches(password, link.getPassword());
    }
    public PublicLinkResponse getPublicLinkInfo(String code) {

        Link link = linkRepository.findByShortCode(code)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found"));

        PublicLinkResponse response = new PublicLinkResponse();

        response.setTitle(link.getTitle());

        response.setPasswordProtected(
                link.getPassword() != null
                        && !link.getPassword().isBlank());

        response.setActive(link.getIsActive());

        response.setExpired(
                link.getExpirationDate() != null
                        && link.getExpirationDate().isBefore(LocalDateTime.now()));

        return response;
    }
    public LinkResponse getLinkById(Long id) {
        Link link = linkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found"));
        return linkMapper.toResponse(link);
    }

    public List<ClickHistoryResponse> getClickHistory(Long linkId) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(linkId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Link not found"));

        if (!link.getUser().getId().equals(currentUser.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only view your own analytics.");
        }

        return clickAnalyticsService.getClickHistory(link);
    }
}