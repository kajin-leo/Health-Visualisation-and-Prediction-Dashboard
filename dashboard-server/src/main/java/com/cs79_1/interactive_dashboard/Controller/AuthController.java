package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.Authenticate.LoginRequest;
import com.cs79_1.interactive_dashboard.DTO.Authenticate.LoginResponse;
import com.cs79_1.interactive_dashboard.DTO.Authenticate.RegisterRequest;
import com.cs79_1.interactive_dashboard.Entity.User;
import com.cs79_1.interactive_dashboard.Enum.Role;
import com.cs79_1.interactive_dashboard.Repository.UserRepository;
import com.cs79_1.interactive_dashboard.Security.JwtUtil;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
            }

            User user = userOptional.get();
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
            }

            String accessToken = jwtUtil.generateToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);

            LoginResponse loginResponse = new LoginResponse(
                    accessToken,
                    refreshToken,
                    "Bearer",
                    user.getId(),
                    user.getUsername(),
                    user.getRole() != null ? user.getRole().name() : "USER"
            );

            logger.info("User {} logged in successfully!", user.getUsername());
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error occurred during logging in"));
        }
    }

    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Username already exists"));
            }

            User newUser = new User();
            newUser.setUsername(registerRequest.getUsername());
            newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            newUser.setRole(registerRequest.isAdmin() ? Role.ADMIN : Role.USER);

            User savedUser = userRepository.save(newUser);

            logger.info("New {} registered: {}", savedUser.getRole().name(), savedUser.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", savedUser.getId());
            response.put("username", savedUser.getUsername());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Registration error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error occurred during registration"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        try {
            if (refreshToken.startsWith("Bearer ")) {
                refreshToken = refreshToken.substring(7);
            }

            if (!jwtUtil.isTokenValid(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
            }

            String username = jwtUtil.extractUsername(refreshToken);
            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not fount"));
            }

            User user = userOptional.get();
            String newAccessToken = jwtUtil.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", newAccessToken);
            response.put("tokenType", "Bearer");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Refresh token error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error occurred during refreshing token"));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            if (jwtUtil.isTokenValid(token)) {
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("username", jwtUtil.extractUsername(token));
                response.put("userId", jwtUtil.extractUserId(token));
                response.put("role", jwtUtil.extractRole(token));
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.ok(Map.of("valid", false));
            }
        } catch (Exception e) {
            logger.error("Validate token error: ", e);
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }
}
