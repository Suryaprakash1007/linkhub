package com.example.linkhubbackend.repository;

import com.example.linkhubbackend.entity.LinkCollection;
import com.example.linkhubbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LinkCollectionRepository extends JpaRepository<LinkCollection, Long> {

    List<LinkCollection> findByUserOrderByCreatedAtDesc(User user);

    Optional<LinkCollection> findByIdAndUser(Long id, User user);

    boolean existsByUserAndName(User user, String name);
}