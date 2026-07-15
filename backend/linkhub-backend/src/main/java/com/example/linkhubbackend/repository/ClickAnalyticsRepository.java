package com.example.linkhubbackend.repository;

import com.example.linkhubbackend.entity.ClickAnalytics;
import com.example.linkhubbackend.entity.Link;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClickAnalyticsRepository
        extends JpaRepository<ClickAnalytics, Long> {

    List<ClickAnalytics> findByLink(Link link);

    long countByLinkId(Long linkId);

    long countByLinkIdAndDeviceType(Long linkId, String deviceType);

    long countByLinkIdAndBrowser(Long linkId, String browser);

    List<ClickAnalytics> findByLinkOrderByClickedAtDesc(Link link); 

}