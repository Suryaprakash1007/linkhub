package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.AiChatRequest;
import com.example.linkhubbackend.dto.AiChatResponse;
import com.example.linkhubbackend.dto.AiSuggestionRequest;
import com.example.linkhubbackend.dto.AiSuggestionResponse;
import com.example.linkhubbackend.service.AiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/suggest")
    public ResponseEntity<AiSuggestionResponse> suggestMetadata(@Valid @RequestBody AiSuggestionRequest request) {
        return ResponseEntity.ok(aiService.suggestMetadata(request.getUrl()));
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiService.chat(request.getMessage()));
    }
}
