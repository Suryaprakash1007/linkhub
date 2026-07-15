package com.example.linkhubbackend.service;

import com.example.linkhubbackend.dto.AnalyticsResponse;
import com.example.linkhubbackend.dto.ClickHistoryResponse;
import com.example.linkhubbackend.entity.ClickAnalytics;
import com.example.linkhubbackend.entity.Link;
import com.example.linkhubbackend.repository.ClickAnalyticsRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClickAnalyticsService {

    private final ClickAnalyticsRepository clickAnalyticsRepository;

    public ClickAnalyticsService(
            ClickAnalyticsRepository clickAnalyticsRepository) {
        this.clickAnalyticsRepository = clickAnalyticsRepository;
    }

    public void recordClick(Link link, HttpServletRequest request) {

        ClickAnalytics analytics = new ClickAnalytics();

        analytics.setLink(link);
        analytics.setClickedAt(LocalDateTime.now());

        analytics.setIpAddress(request.getRemoteAddr());

        String userAgent = request.getHeader("User-Agent");

        if (userAgent == null) {
            analytics.setBrowser("unknown");
        }
        else if (userAgent.contains("Edg")) {
            analytics.setBrowser("Edge");
        }
        else if (userAgent.contains("Chrome")) {
            analytics.setBrowser("Chrome");
        }
        else if (userAgent.contains("Firefox")) {
            analytics.setBrowser("Firefox");
        }
        else if (userAgent.contains("Safari")) {
            analytics.setBrowser("Safari");
        }
        else {
            analytics.setBrowser("Other");
        }

        analytics.setReferrer(request.getHeader("Referer"));

        if (userAgent == null) {
            analytics.setOperatingSystem("Unknown");
        }
        else if (userAgent.contains("Windows")) {
            analytics.setOperatingSystem("Windows");
        }
        else if (userAgent.contains("Android")) {
            analytics.setOperatingSystem("Android");
        }
        else if (userAgent.contains("iPhone") || userAgent.contains("iPad")) {
            analytics.setOperatingSystem("iOS");
        }
        else if (userAgent.contains("Mac")) {
            analytics.setOperatingSystem("macOS");
        }
        else if (userAgent.contains("Linux")) {
            analytics.setOperatingSystem("Linux");
        }
        else {
            analytics.setOperatingSystem("Other");
        }

        clickAnalyticsRepository.save(analytics);
    }
    public AnalyticsResponse getAnalytics(Long linkId) {

        AnalyticsResponse response = new AnalyticsResponse();

        response.setTotalClicks(
                clickAnalyticsRepository.countByLinkId(linkId));

        response.setDesktopClicks(
                clickAnalyticsRepository.countByLinkIdAndDeviceType(
                        linkId,
                        "Desktop"));

        response.setMobileClicks(
                clickAnalyticsRepository.countByLinkIdAndDeviceType(
                        linkId,
                        "Mobile"));

        response.setChromeClicks(
                clickAnalyticsRepository.countByLinkIdAndBrowser(
                        linkId,
                        "Chrome"));

        response.setEdgeClicks(
                clickAnalyticsRepository.countByLinkIdAndBrowser(
                        linkId,
                        "Edge"));

        response.setFirefoxClicks(
                clickAnalyticsRepository.countByLinkIdAndBrowser(
                        linkId,
                        "Firefox"));

        long other =
                response.getTotalClicks()
                        - response.getChromeClicks()
                        - response.getEdgeClicks()
                        - response.getFirefoxClicks();

        response.setOtherBrowserClicks(other);

        return response;
    }
    public List<ClickHistoryResponse> getClickHistory(Link link) {

        List<ClickAnalytics> analytics =
                clickAnalyticsRepository
                        .findByLinkOrderByClickedAtDesc(link);

        return analytics.stream()
                .map(click -> {

                    ClickHistoryResponse response =
                            new ClickHistoryResponse();

                    response.setClickedAt(click.getClickedAt());

                    response.setBrowser(click.getBrowser());

                    response.setOperatingSystem(
                            click.getOperatingSystem());

                    response.setDeviceType(
                            click.getDeviceType());

                    response.setIpAddress(
                            click.getIpAddress());

                    response.setReferrer(
                            click.getReferrer());

                    return response;
                })
                .toList();
    }

}