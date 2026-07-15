package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.AnalyticsResponse;
import com.example.linkhubbackend.service.ClickAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final ClickAnalyticsService clickAnalyticsService;

    public AnalyticsController(ClickAnalyticsService clickAnalyticsService) {
        this.clickAnalyticsService = clickAnalyticsService;
    }

    @GetMapping("/{linkId}")
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @PathVariable Long linkId) {

        return ResponseEntity.ok(
                clickAnalyticsService.getAnalytics(linkId));
    }
}