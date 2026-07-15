package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.PublicLinkResponse;
import com.example.linkhubbackend.service.LinkService;
import com.example.linkhubbackend.service.QRCodeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/r")
public class RedirectController {

    private final LinkService linkService;

    private final QRCodeService qrCodeService;

    public RedirectController(LinkService linkService,
                              QRCodeService qrCodeService) {
        this.linkService = linkService;
        this.qrCodeService = qrCodeService;
    }

    @GetMapping("/{code}")
    public RedirectView redirect(
            @PathVariable String code,
            HttpServletRequest request) {

        String url = linkService.redirect(code, request);
        return new RedirectView(url);
    }
    @GetMapping("/{code}/qrcode")
    public ResponseEntity<byte[]> generateQRCode(
            @PathVariable String code)
            throws Exception {

        String shortUrl =
                "http://localhost:8080/api/links/" + code;

        byte[] qrCode = qrCodeService.generateQRCode(shortUrl);

        return ResponseEntity.ok()
                .header("Content-Type", "image/png")
                .body(qrCode);
    }
    @GetMapping("/{code}/info")
    public ResponseEntity<PublicLinkResponse> getPublicInfo(
            @PathVariable String code) {

        return ResponseEntity.ok(
                linkService.getPublicLinkInfo(code));
    }
}