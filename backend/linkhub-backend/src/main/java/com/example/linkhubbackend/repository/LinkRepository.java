package com.example.linkhubbackend.repository;

import com.example.linkhubbackend.entity.Link;
import com.example.linkhubbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.example.linkhubbackend.entity.Category;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LinkRepository extends JpaRepository<Link, Long> {

    Optional<Link> findByShortCode(String shortCode);

    Optional<Link> findByCustomAlias(String customAlias);

    boolean existsByShortCode(String shortCode);

    boolean existsByCustomAlias(String customAlias);

    List<Link> findByUser(User user);
    Optional<Link> findByShortCodeOrCustomAlias(String shortCode, String customAlias);
    List<Link> findByUserOrderByCreatedAtDesc(User user);
    Page<Link> findByUser(User user, Pageable pageable);
    Page<Link> findByUserAndIsActiveOrderByCreatedAtDesc(User user, Boolean isActive, Pageable pageable);

    Page<Link> findByUserAndExpirationDateBeforeOrderByCreatedAtDesc(
            User user,
            LocalDateTime dateTime,
            Pageable pageable);

    Page<Link> findByUserAndExpirationDateAfterOrderByCreatedAtDesc(
            User user,
            LocalDateTime dateTime,
            Pageable pageable);

    Page<Link> findByUserAndCustomAliasIsNotNullOrderByCreatedAtDesc(User user, Pageable pageable);

    Page<Link> findByUserAndCustomAliasIsNullOrderByCreatedAtDesc(User user, Pageable pageable);
    Page<Link> findByUserAndIsFavoriteTrueOrderByCreatedAtDesc(User user, Pageable pageable);
    List<Link> findByCategoryOrderByCreatedAtDesc(Category category);
    Page<Link> findByUserAndIsPinnedTrueOrderByCreatedAtDesc(User user, Pageable pageable);
    long countByUser(User user);

    long countByUserAndIsActiveTrue(User user);

    long countByUserAndIsFavoriteTrue(User user);

    long countByUserAndIsPinnedTrue(User user);

    List<Link> findByUserOrderByClickCountDesc(User user);
    @Query("""
SELECT l FROM Link l
WHERE l.user = :user
AND (
LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
OR LOWER(l.originalUrl) LIKE LOWER(CONCAT('%', :keyword, '%'))
OR LOWER(l.customAlias) LIKE LOWER(CONCAT('%', :keyword, '%'))
OR LOWER(l.notes) LIKE LOWER(CONCAT('%', :keyword, '%'))
)
ORDER BY l.createdAt DESC
""")
    Page<Link> searchLinks(
            @Param("user") User user,
            @Param("keyword") String keyword,
            Pageable pageable);
}