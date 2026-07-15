package com.example.linkhubbackend.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.linkhubbackend.dto.CreatePostRequest;
import com.example.linkhubbackend.dto.PostResponse;
import com.example.linkhubbackend.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.linkhubbackend.dto.UpdatePostRequest;
@RestController
@RequestMapping("/api/posts")
public class PostController {
    private static final Logger log =
            LoggerFactory.getLogger(PostController.class);
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody CreatePostRequest request) {

        PostResponse response = postService.createPost(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {

        return ResponseEntity.ok(postService.getAllPosts());
    }
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {

        return ResponseEntity.ok(postService.getPostById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request) {

        return ResponseEntity.ok(postService.updatePost(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {

        postService.deletePost(id);

        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{id}/like")
    public ResponseEntity<String> likePost(@PathVariable Long id) {

        postService.likePost(id);

        return ResponseEntity.ok("Post liked successfully.");
    }
    @DeleteMapping("/{id}/unlike")
    public ResponseEntity<String> unlikePost(@PathVariable Long id) {

        log.info("Delete Link API called.");

        postService.unlikePost(id);

        return ResponseEntity.ok("Post unliked successfully.");
    }
}