package com.example.linkhubbackend.service;

import com.example.linkhubbackend.dto.*;
import com.example.linkhubbackend.entity.PasswordResetToken;
import com.example.linkhubbackend.entity.User;
import com.example.linkhubbackend.exception.EmailAlreadyExistsException;
import com.example.linkhubbackend.repository.PasswordResetTokenRepository;
import com.example.linkhubbackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.example.linkhubbackend.security.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.linkhubbackend.dto.UpdateProfileRequest;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final CloudinaryService cloudinaryService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       EmailService emailService,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       CloudinaryService cloudinaryService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REGISTER — saves user, sends verification email
    // ─────────────────────────────────────────────────────────────────────────
    public RegisterResponse registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already registered.");
        }

        String verificationToken = UUID.randomUUID().toString();

        String baseUsername = request.getEmail().split("@")[0].replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        if (baseUsername.isEmpty()) baseUsername = "user";
        String username = baseUsername;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(username)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .emailVerified(false)
                .emailVerificationToken(verificationToken)
                .emailVerificationTokenExpiry(LocalDateTime.now().plusHours(24))
                .build();

        userRepository.save(user);

        // Send email asynchronously (non-blocking)
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verificationToken);

        return new RegisterResponse("Registration successful! Please check your email to verify your account.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LOGIN — blocks unverified users
    // ─────────────────────────────────────────────────────────────────────────
    public LoginResponse loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // Block login if email not yet verified
        if (Boolean.FALSE.equals(user.getEmailVerified())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Please verify your email first. Check your inbox for the verification link."
            );
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(token, "Login successful");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VERIFY EMAIL
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid or already used verification link."));

        if (user.getEmailVerificationTokenExpiry() == null ||
                LocalDateTime.now().isAfter(user.getEmailVerificationTokenExpiry())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Verification link has expired. Please register again.");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);
        userRepository.save(user);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FORGOT PASSWORD — sends reset email
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        // Always succeed silently to prevent email enumeration
        if (userOptional.isEmpty()) {
            return;
        }

        User user = userOptional.get();

        // Delete any existing reset tokens for this user
        passwordResetTokenRepository.deleteByUser(user);

        String resetToken = UUID.randomUUID().toString();

        PasswordResetToken prt = PasswordResetToken.builder()
                .token(resetToken)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();

        passwordResetTokenRepository.save(prt);

        // Send email asynchronously
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), resetToken);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RESET PASSWORD — validates token and sets new password
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        System.out.println(">>> RECEIVED TOKEN FOR RESET: '" + request.getToken() + "'");

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match.");
        }

        PasswordResetToken prt = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> {
                    System.out.println(">>> TOKEN NOT FOUND IN DB: '" + request.getToken() + "'");
                    return new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Invalid or expired reset link.");
                });

        if (Boolean.TRUE.equals(prt.getUsed())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This reset link has already been used.");
        }

        if (LocalDateTime.now().isAfter(prt.getExpiresAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset link has expired. Please request a new one.");
        }

        User user = prt.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PROFILE OPERATIONS
    // ─────────────────────────────────────────────────────────────────────────
    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfileResponse getCurrentUserProfile() {

        User user = getCurrentUser();

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .college(user.getCollege())
                .department(user.getDepartment())
                .location(user.getLocation())
                .build();
    }

    public UserProfileResponse updateProfile(UpdateProfileRequest request) {

        User user = getCurrentUser();

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is already taken.");
            }
            user.setUsername(request.getUsername());
        }

        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        user.setProfilePicture(request.getProfilePicture());
        user.setCollege(request.getCollege());
        user.setDepartment(request.getDepartment());
        user.setLocation(request.getLocation());

        userRepository.save(user);

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .college(user.getCollege())
                .department(user.getDepartment())
                .location(user.getLocation())
                .build();
    }

    public UserProfileResponse uploadProfilePicture(org.springframework.web.multipart.MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadImage(file);
            User user = getCurrentUser();
            user.setProfilePicture(imageUrl);
            userRepository.save(user);
            return getCurrentUserProfile();
        } catch (java.io.IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image");
        }
    }

    public void changePassword(ChangePasswordRequest request) {

        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
