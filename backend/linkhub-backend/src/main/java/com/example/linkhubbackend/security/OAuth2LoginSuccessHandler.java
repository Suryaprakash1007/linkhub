package com.example.linkhubbackend.security;

import com.example.linkhubbackend.entity.User;
import com.example.linkhubbackend.enums.AuthProvider;
import com.example.linkhubbackend.enums.Role;
import com.example.linkhubbackend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.frontend.oauth2.redirect-uri:http://localhost:5173/oauth2/redirect}")
    private String frontendRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .fullName(name)
                    // We need a unique username for Google users, let's use the first part of email + random
                    .username(email.split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 5))
                    .password(UUID.randomUUID().toString()) // random password for OAuth users
                    .profilePicture(picture)
                    .role(Role.USER)
                    .isActive(true)
                    .emailVerified(true) // Google has already verified it
                    .authProvider(AuthProvider.GOOGLE)
                    .build();
            return userRepository.save(newUser);
        });

        // Generate JWT Token
        String token = jwtService.generateToken(user.getEmail());

        // Redirect to Frontend with token
        String redirectUrl = frontendRedirectUri + "?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
