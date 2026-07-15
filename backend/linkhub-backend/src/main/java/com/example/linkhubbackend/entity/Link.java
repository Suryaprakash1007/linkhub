package com.example.linkhubbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.example.linkhubbackend.entity.Tag;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "links",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "short_code"),
                @UniqueConstraint(columnNames = "custom_alias")
        }
)
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String originalUrl;

    @Column(name = "short_code", nullable = false, unique = true, length = 20)
    private String shortCode;

    @Column(name = "custom_alias", unique = true, length = 50)
    private String customAlias;

    @Column(length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Long clickCount = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    private LocalDateTime expirationDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private Boolean isFavorite;

    @Column(name = "password")
    private String password;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isPinned = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToMany(mappedBy = "links")
    @Builder.Default
    private Set<LinkCollection> collections = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "link_tags",
            joinColumns = @JoinColumn(name = "link_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
    @Column(nullable = false)

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (clickCount == null) {
            clickCount = 0L;
        }

        if (isActive == null) {
            isActive = true;
        }

        if (isFavorite == null) {
            isFavorite = false;
        }

        if (isPinned == null) {
            isPinned = false;
        }
    }
}