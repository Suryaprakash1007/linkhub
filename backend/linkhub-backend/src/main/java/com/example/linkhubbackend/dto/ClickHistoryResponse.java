package com.example.linkhubbackend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ClickHistoryResponse {

    private LocalDateTime clickedAt;

    private String browser;

    private String operatingSystem;

    private String deviceType;

    private String ipAddress;

    private String referrer;
}