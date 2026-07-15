package com.example.linkhubbackend.service;

import com.example.linkhubbackend.repository.TagRepository;
import org.springframework.stereotype.Service;
import com.example.linkhubbackend.dto.CreateTagRequest;
import com.example.linkhubbackend.dto.TagResponse;
import com.example.linkhubbackend.dto.UpdateTagRequest;
import com.example.linkhubbackend.entity.Tag;
import com.example.linkhubbackend.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
@Service
public class TagService {

    private final TagRepository tagRepository;
    private final UserService userService;

    public TagService(TagRepository tagRepository,
                      UserService userService) {

        this.tagRepository = tagRepository;
        this.userService = userService;
    }
    public TagResponse createTag(CreateTagRequest request) {

        User currentUser = userService.getCurrentUser();

        if (tagRepository.existsByUserAndName(currentUser, request.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tag already exists.");
        }

        Tag tag = Tag.builder()
                .name(request.getName())
                .user(currentUser)
                .build();

        Tag saved = tagRepository.save(tag);

        return mapToResponse(saved);
    }
    public List<TagResponse> getMyTags() {

        User currentUser = userService.getCurrentUser();

        return tagRepository.findByUserOrderByNameAsc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    public TagResponse updateTag(Long id,
                                 UpdateTagRequest request) {

        User currentUser = userService.getCurrentUser();

        Tag tag = tagRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tag not found."));

        if (!tag.getName().equalsIgnoreCase(request.getName())
                && tagRepository.existsByUserAndName(currentUser, request.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tag already exists.");
        }

        tag.setName(request.getName());

        Tag updated = tagRepository.save(tag);

        return mapToResponse(updated);
    }
    public void deleteTag(Long id) {

        User currentUser = userService.getCurrentUser();

        Tag tag = tagRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tag not found."));

        tagRepository.delete(tag);
    }
    private TagResponse mapToResponse(Tag tag) {

        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .totalLinks((long) tag.getLinks().size())
                .build();
    }
}