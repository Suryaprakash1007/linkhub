package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.LinkResponse;
import com.example.linkhubbackend.dto.PublicProfileResponse;
import com.example.linkhubbackend.entity.User;
import com.example.linkhubbackend.mapper.LinkMapper;
import com.example.linkhubbackend.repository.LinkRepository;
import com.example.linkhubbackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/users")
public class PublicProfileController {

    private final UserRepository userRepository;
    private final LinkRepository linkRepository;
    private final LinkMapper linkMapper;

    public PublicProfileController(UserRepository userRepository, LinkRepository linkRepository, LinkMapper linkMapper) {
        this.userRepository = userRepository;
        this.linkRepository = linkRepository;
        this.linkMapper = linkMapper;
    }

    @GetMapping("/{username}")
    public ResponseEntity<PublicProfileResponse> getPublicProfile(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        PublicProfileResponse response = PublicProfileResponse.builder()
                .fullName(user.getFullName())
                .username(user.getUsername())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .college(user.getCollege())
                .department(user.getDepartment())
                .location(user.getLocation())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{username}/links")
    public ResponseEntity<List<LinkResponse>> getPublicLinks(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Only return links that are active (for now, unpaged for public profile)
        List<LinkResponse> links = linkRepository.findByUserAndIsActiveOrderByCreatedAtDesc(user, true, org.springframework.data.domain.Pageable.unpaged())
                .stream()
                .map(linkMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(links);
    }
}
