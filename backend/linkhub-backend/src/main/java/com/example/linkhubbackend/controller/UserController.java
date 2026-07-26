package com.example.linkhubbackend.controller;

import com.example.linkhubbackend.dto.*;
import com.example.linkhubbackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ── Registration ──────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse response = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        LoginResponse response = userService.loginUser(request);
        return ResponseEntity.ok(response);
    }

    // ── Email Verification ────────────────────────────────────────────────────
    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {

        userService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully! You can now log in."));
    }

    // ── Forgot Password ───────────────────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        userService.forgotPassword(request);
        // Always respond with same message to prevent email enumeration
        return ResponseEntity.ok(Map.of("message",
                "If that email is registered, a password reset link has been sent to your inbox."));
    }

    // ── Reset Password ────────────────────────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully! You can now log in."));
    }

    // ── Profile ───────────────────────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PostMapping("/me/profile-picture")
    public ResponseEntity<UserProfileResponse> uploadProfilePicture(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.ok(userService.uploadProfilePicture(file));
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);
        return ResponseEntity.ok("Password changed successfully");
    }
}
