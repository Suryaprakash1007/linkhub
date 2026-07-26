package com.example.linkhubbackend.service;

import com.example.linkhubbackend.dto.AiSuggestionResponse;
import com.example.linkhubbackend.dto.AiChatResponse;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.Collections;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiSuggestionResponse suggestMetadata(String url) {
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;

        String websiteContent = "";
        try {
            org.jsoup.nodes.Document doc = org.jsoup.Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(30000)
                    .get();
            
            String title = doc.title();
            org.jsoup.select.Elements metaTags = doc.getElementsByTag("meta");
            String description = "";
            for (org.jsoup.nodes.Element metaTag : metaTags) {
                if ("description".equalsIgnoreCase(metaTag.attr("name"))) {
                    description = metaTag.attr("content");
                    break;
                }
            }
            
            // Get up to 1000 chars of body text to help the AI
            String bodyText = doc.body().text();
            if (bodyText.length() > 1000) {
                bodyText = bodyText.substring(0, 1000);
            }
            
            websiteContent = "Website Title: " + title + "\n" +
                             "Website Meta Description: " + description + "\n" +
                             "Website Body Snippet: " + bodyText + "\n";
                             
        } catch (Exception e) {
            // If fetching fails, we fallback to just the URL string
            websiteContent = "Could not fetch website content. Analyze based solely on the URL string itself.\n";
            System.err.println("Could not fetch website content for URL " + url + ": " + e.getMessage());
        }

        String prompt = "Given this URL: " + url + " and its content below, analyze what the URL is about. " +
                "If the content says it could not be fetched, guess based on the URL name alone. " +
                "CRITICAL INSTRUCTION: If this URL is hosted on a cloud provider (like Render, Vercel, Netlify, Heroku, AWS), DO NOT describe the cloud provider. Describe the actual application/website. If the content is mostly empty, rely entirely on the Title or URL text to guess the purpose.\n\n" +
                "Content:\n" + websiteContent + "\n\n" +
                "Return ONLY a raw JSON object (without markdown code blocks) with the following string fields: " +
                "1) 'title': A short, catchy title. " +
                "2) 'description': A highly detailed, comprehensive multi-sentence explanation of what the page contains and why it might be useful. " +
                "3) 'category': A single word or short phrase for the best category (e.g. Technology, News, Tutorial). " +
                "Do not include any other text.";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode contentNode = candidates.get(0).path("content");
                JsonNode parts = contentNode.path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    String jsonString = parts.get(0).path("text").asText();
                    // Sometimes LLMs return markdown code blocks anyway, strip them
                    if (jsonString.startsWith("```json")) {
                        jsonString = jsonString.substring(7);
                    }
                    if (jsonString.startsWith("```")) {
                        jsonString = jsonString.substring(3);
                    }
                    if (jsonString.endsWith("```")) {
                        jsonString = jsonString.substring(0, jsonString.length() - 3);
                    }
                    
                    return objectMapper.readValue(jsonString.trim(), AiSuggestionResponse.class);
                }
            }
            throw new RuntimeException("Unexpected response structure from Gemini API");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate AI suggestion: " + e.getMessage());
        }
    }

    public AiChatResponse chat(String userMessage) {
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;

        String systemPrompt = "You are LinkBot, a highly intelligent and friendly AI assistant specifically built for LinkHub. " +
                "LinkHub is a modern, professional bookmark and link management platform. " +
                "Here is how LinkHub works so you can answer user questions accurately:\n" +
                "- Dashboard: Shows total links, collections, tags, and recent links.\n" +
                "- Adding Links: Users can add links by clicking 'Create Link'. They can provide a URL, Title, Description, and assign Tags/Collections. They can also use the 'AI Suggest' button to automatically generate metadata for any URL.\n" +
                "- Security: Links can be password protected. Users can toggle 'Is Private' on links so they don't show up on public profiles.\n" +
                "- Organization: Users group links into 'Collections' (folders) and 'Tags' (labels). A link can have multiple tags but belongs to one collection.\n" +
                "- Public Profiles: Users have a public profile page (e.g., /u/username) where they can share their public links with others.\n" +
                "- Posts/Community: Users can create public posts to share collections of links with the community.\n" +
                "- Analytics: Users can track clicks and views on their links.\n" +
                "When answering questions about LinkHub, be concise, encouraging, and provide step-by-step guidance if they ask how to do something. Do not use markdown if possible, just plain text.";

        String fullPrompt = systemPrompt + "\n\nUser: " + userMessage;

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        
        parts.put("text", fullPrompt);
        contents.put("parts", Collections.singletonList(parts));
        requestBody.put("contents", Collections.singletonList(contents));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            String textResponse = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            return AiChatResponse.builder()
                    .reply(textResponse.trim())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate AI chat response: " + e.getMessage(), e);
        }
    }
}
