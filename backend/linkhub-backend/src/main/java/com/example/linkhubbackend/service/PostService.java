package com.example.linkhubbackend.service;


import com.example.linkhubbackend.dto.CreatePostRequest;
import com.example.linkhubbackend.dto.PostResponse;
import com.example.linkhubbackend.dto.UpdatePostRequest;
import com.example.linkhubbackend.entity.Post;
import com.example.linkhubbackend.entity.User;
import com.example.linkhubbackend.repository.LikeRepository;
import com.example.linkhubbackend.repository.PostRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import com.example.linkhubbackend.entity.Like;
import org.springframework.security.access.AccessDeniedException;
@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserService userService;

    public PostService(PostRepository postRepository,
                       UserService userService,
                       LikeRepository likeRepository) {

        this.postRepository = postRepository;
        this.userService = userService;
        this.likeRepository = likeRepository;
    }

    public PostResponse createPost(CreatePostRequest request) {

        User currentUser = userService.getCurrentUser();

        Post post = Post.builder()
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .user(currentUser)
                .build();

        Post savedPost = postRepository.save(post);

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .userId(post.getUser().getId())
                .fullName(post.getUser().getFullName())
                .createdAt(post.getCreatedAt())
                .likeCount(likeRepository.countByPost(post))
                .build();
    }
    public List<PostResponse> getAllPosts() {

        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .content(post.getContent())
                        .imageUrl(post.getImageUrl())
                        .userId(post.getUser().getId())
                        .fullName(post.getUser().getFullName())
                        .createdAt(post.getCreatedAt())
                        .likeCount(likeRepository.countByPost(post))
                        .build())
                .toList();
    }
    public PostResponse getPostById(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Post not found"));

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .userId(post.getUser().getId())
                .fullName(post.getUser().getFullName())
                .createdAt(post.getCreatedAt())
                .likeCount(likeRepository.countByPost(post))
                .build();
    }
    public PostResponse updatePost(Long id, UpdatePostRequest request) {

        User currentUser = userService.getCurrentUser();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only edit your own posts.");
        }

        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());

        Post updatedPost = postRepository.save(post);

        return PostResponse.builder()
                .id(updatedPost.getId())
                .content(updatedPost.getContent())
                .imageUrl(updatedPost.getImageUrl())
                .userId(updatedPost.getUser().getId())
                .fullName(updatedPost.getUser().getFullName())
                .createdAt(updatedPost.getCreatedAt())
                .build();
    }
    public void deletePost(Long id) {

        User currentUser = userService.getCurrentUser();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only delete your own posts.");
        }

        postRepository.delete(post);
    }
    private final LikeRepository likeRepository;
    public void likePost(Long postId) {

        User currentUser = userService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (likeRepository.existsByUserAndPost(currentUser, post)) {
            throw new RuntimeException("You have already liked this post.");
        }

        Like like = Like.builder()
                .user(currentUser)
                .post(post)
                .build();

        likeRepository.save(like);
    }
    public void unlikePost(Long postId) {

        User user = userService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Post not found"));

        if (!likeRepository.existsByUserAndPost(user, post)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You have not liked this post");
        }

        likeRepository.deleteByUserAndPost(user, post);
    }
}