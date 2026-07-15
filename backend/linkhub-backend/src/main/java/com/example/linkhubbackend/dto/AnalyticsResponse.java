package com.example.linkhubbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalyticsResponse {

    private long totalClicks;

    private long desktopClicks;

    private long mobileClicks;

    private long chromeClicks;

    private long edgeClicks;

    private long firefoxClicks;

    private long otherBrowserClicks;
}