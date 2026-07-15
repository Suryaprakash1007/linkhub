package com.example.linkhubbackend.repository;

import com.example.linkhubbackend.entity.Link;
import com.example.linkhubbackend.entity.Tag;
import com.example.linkhubbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByUserOrderByNameAsc(User user);

    Optional<Tag> findByIdAndUser(Long id, User user);

    boolean existsByUserAndName(User user, String name);

    List<Tag> findByLinksContainingOrderByNameAsc(Link link);
}