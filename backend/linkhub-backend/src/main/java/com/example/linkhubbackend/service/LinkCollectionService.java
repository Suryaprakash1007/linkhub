package com.example.linkhubbackend.service;

import com.example.linkhubbackend.dto.*;
import com.example.linkhubbackend.entity.Link;
import com.example.linkhubbackend.entity.LinkCollection;
import com.example.linkhubbackend.entity.User;
import com.example.linkhubbackend.mapper.LinkMapper;
import com.example.linkhubbackend.repository.LinkCollectionRepository;
import com.example.linkhubbackend.repository.LinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
public class LinkCollectionService {

    private final LinkCollectionRepository linkCollectionRepository;

    private final UserService userService;

    private final LinkRepository linkRepository;

    private final LinkMapper linkMapper;

    public LinkCollectionService(
            LinkCollectionRepository linkCollectionRepository,
            LinkRepository linkRepository,
            UserService userService,
            LinkMapper linkMapper) {

        this.linkCollectionRepository = linkCollectionRepository;
        this.linkRepository = linkRepository;
        this.userService = userService;
        this.linkMapper = linkMapper;
    }
    public LinkCollectionResponse createCollection(CreateCollectionRequest request) {

        User currentUser = userService.getCurrentUser();

        if (linkCollectionRepository.existsByUserAndName(currentUser, request.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Collection already exists.");
        }

        LinkCollection collection = LinkCollection.builder()
                .name(request.getName())
                .description(request.getDescription())
                .user(currentUser)
                .build();

        LinkCollection saved = linkCollectionRepository.save(collection);

        return mapToResponse(saved);
    }
    public List<LinkCollectionResponse> getMyCollections() {

        User currentUser = userService.getCurrentUser();

        return linkCollectionRepository
                .findByUserOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    public LinkCollectionResponse updateCollection(
            Long id,
            UpdateCollectionRequest request) {

        User currentUser = userService.getCurrentUser();

        LinkCollection collection =
                linkCollectionRepository.findByIdAndUser(id, currentUser)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Collection not found."));

        if (!collection.getName().equalsIgnoreCase(request.getName())
                && linkCollectionRepository.existsByUserAndName(currentUser, request.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Collection already exists.");
        }

        collection.setName(request.getName());
        collection.setDescription(request.getDescription());

        LinkCollection updated = linkCollectionRepository.save(collection);

        return mapToResponse(updated);
    }
    public void deleteCollection(Long id) {

        User currentUser = userService.getCurrentUser();

        LinkCollection collection =
                linkCollectionRepository.findByIdAndUser(id, currentUser)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Collection not found."));

        linkCollectionRepository.delete(collection);
    }
    private LinkCollectionResponse mapToResponse(LinkCollection collection) {

        return LinkCollectionResponse.builder()
                .id(collection.getId())
                .name(collection.getName())
                .description(collection.getDescription())
                .totalLinks((long) collection.getLinks().size())
                .createdAt(collection.getCreatedAt())
                .build();
    }
    public LinkCollectionResponse addLinkToCollection(
            Long collectionId,
            Long linkId) {

        User currentUser = userService.getCurrentUser();

        LinkCollection collection = linkCollectionRepository
                .findByIdAndUser(collectionId, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Collection not found."));

        Link link = linkRepository.findById(linkId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found."));

        if (!link.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only add your own links.");
        }

        collection.getLinks().add(link);

        LinkCollection saved =
                linkCollectionRepository.save(collection);

        return mapToResponse(saved);
    }
    public LinkCollectionResponse removeLinkFromCollection(
            Long collectionId,
            Long linkId) {

        User currentUser = userService.getCurrentUser();

        LinkCollection collection = linkCollectionRepository
                .findByIdAndUser(collectionId, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Collection not found."));

        Link link = linkRepository.findById(linkId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link not found."));

        collection.getLinks().remove(link);

        LinkCollection saved =
                linkCollectionRepository.save(collection);

        return mapToResponse(saved);
    }
    public List<LinkResponse> getCollectionLinks(Long collectionId) {

        User currentUser = userService.getCurrentUser();

        LinkCollection collection = linkCollectionRepository
                .findByIdAndUser(collectionId, currentUser)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Collection not found."));

        return collection.getLinks()
                .stream()
                .map(linkMapper::toResponse)
                .toList();
    }
}