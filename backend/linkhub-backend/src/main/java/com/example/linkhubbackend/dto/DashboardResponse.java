package com.example.linkhubbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardResponse {

    private long totalLinks;

    private long totalClicks;

    private long activeLinks;

    private long expiredLinks;

    private long favoriteLinks;

    private long pinnedLinks;

    private String mostClickedTitle;

    private long mostClickedCount;
}