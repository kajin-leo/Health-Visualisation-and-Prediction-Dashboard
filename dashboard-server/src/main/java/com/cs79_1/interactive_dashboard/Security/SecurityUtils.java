package com.cs79_1.interactive_dashboard.Security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
    private static final Logger logger = LoggerFactory.getLogger(SecurityUtils.class);

    public static long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            logger.info("Authentication object:{}", authentication);
            if (authentication == null && !authentication.isAuthenticated()) {
                throw new RuntimeException("User not authenticated");
            }

            if (authentication instanceof JwtAuthenticationToken) {
                JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
                Jwt jwt = jwtAuth.getToken();

                Object userIdClaim = jwt.getClaim("userId");
                if (userIdClaim != null) {
                    return Long.parseLong(userIdClaim.toString());
                }

                throw new RuntimeException("UserId not found in JWT token");
            }

            throw new RuntimeException("Unsupported authentication type");
        } catch (Exception e) {
            logger.error("Error getting current user id", e);
            throw new RuntimeException("User not authenticated: " + e.getMessage());
        }
    }

    public static boolean isAuthenticated(){
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            return authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken);
        } catch (Exception e) {
            return false;
        }
    }
}
