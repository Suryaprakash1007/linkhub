package com.example.linkhubbackend.service;

import com.example.linkhubbackend.dto.TagResponse;
import com.example.linkhubbackend.mapper.LinkMapper;
import com.example.linkhubbackend.repository.LinkRepository;
import com.example.linkhubbackend.repository.TagRepository;
import org.springframework.stereotype.Service;
import com.example.linkhubbackend.dto.LinkResponse;
import com.example.linkhubbackend.entity.Link;
import com.example.linkhubbackend.entity.Tag;
import com.example.linkhubbackend.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LinkTagService {

    private final LinkRepository linkRepository;
    private final TagRepository tagRepository;
    private final UserService userService;
    private final LinkMapper linkMapper;

    public LinkTagService(
            LinkRepository linkRepository,
            TagRepository tagRepository,
            UserService userService,
            LinkMapper linkMapper) {

        this.linkRepository = linkRepository;
        this.tagRepository = tagRepository;
        this.userService = userService;
        this.linkMapper = linkMapper;
    }
    public LinkResponse assignTag(Long linkId, Long tagId) {

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

        Tag tag = tagRepository.findByIdAndUser(tagId, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tag not found."));

        link.getTags().add(tag);

        Link saved = linkRepository.save(link);

        return linkMapper.toResponse(saved);
    }
    public LinkResponse removeTag(Long linkId, Long tagId) {

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

        Tag tag = tagRepository.findByIdAndUser(tagId, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tag not found."));

        link.getTags().remove(tag);

        Link saved = linkRepository.save(link);

        return linkMapper.toResponse(saved);
    }
    public List<TagResponse> getTagsOfLink(Long linkId) {

        User currentUser = userService.getCurrentUser();

        Link link = linkRepository.findById(linkId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found."));

        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only view your own links.");
        }

        return link.getTags()
                .stream()
                .map(tag -> TagResponse.builder()
                        .id(tag.getId())
                        .name(tag.getName())
                        .totalLinks((long) tag.getLinks().size())
                        .build())
                .toList();
    }
    public List<LinkResponse> getLinksByTag(Long tagId) {

        User currentUser = userService.getCurrentUser();

        Tag tag = tagRepository.findByIdAndUser(tagId, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tag not found."));

        return tag.getLinks()
                .stream()
                .map(linkMapper::toResponse)
                .toList();
    }
}