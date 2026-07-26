package com.example.linkhubbackend.repository;

import com.example.linkhubbackend.entity.Like;
import com.example.linkhubbackend.entity.Post;
import com.example.linkhubbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {

    boolean existsByUserAndPost(User user, Post post);

    void deleteByUserAndPost(User user, Post post);

    void deleteByPost(Post post);

    long countByPost(Post post);
}
