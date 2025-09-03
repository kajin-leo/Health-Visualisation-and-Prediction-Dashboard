package com.cs79_1.interactive_dashboard.Security;

import com.cs79_1.interactive_dashboard.Entity.User;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Service
public class JwtUtil {
    @Autowired
    private JwtEncoder jwtEncoder;

    @Autowired
    private JwtDecoder jwtDecoder;

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @PostConstruct
    public void checkInjection() {
        logger.info("JwtEncoder injected: {}", jwtEncoder != null);
        logger.info("JwtDecoder injected: {}", jwtDecoder != null);
        logger.info("JwtEncoder class: {}", jwtEncoder.getClass().getName());
        logger.info("JwtDecoder class: {}", jwtDecoder.getClass().getName());
    }

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    public String generateToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(jwtExpiration);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("cs79-interactive-dashboard")
                .issuedAt(now)
                .expiresAt(expiry)
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("role", user.getRole() != null ? user.getRole().name() : "USER")
                .build();

        JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build();

        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public String generateTokenWithClaims(User user, Map<String, Object> additionalClaims) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(jwtExpiration);

        JwtClaimsSet.Builder claimsBuilder = JwtClaimsSet.builder()
                .issuer("cs79-interactive-dashboard")
                .issuedAt(now)
                .expiresAt(expiry)
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("role", user.getRole() != null ? user.getRole().name() : "USER");

        if (additionalClaims != null) {
            additionalClaims.forEach(claimsBuilder::claim);
        }

        JwtClaimsSet claims = claimsBuilder.build();
        JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build();

        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public Jwt validateAndParseToken(String token) throws JwtException {
        return jwtDecoder.decode(token);
    }

    public String extractUsername(String token) {
        Jwt jwt = validateAndParseToken(token);
        return jwt.getSubject();
    }

    public Long extractUserId(String token) {
        Jwt jwt = validateAndParseToken(token);
        return jwt.getClaim("userId");
    }

    public String extractRole(String token) {
        Jwt jwt = validateAndParseToken(token);
        return jwt.getClaim("role");
    }

    public boolean isTokenValid(String token) {
        try {
            Jwt jwt = validateAndParseToken(token);
            Instant expiry = jwt.getExpiresAt();
            return expiry != null && expiry.isAfter(Instant.now());
        } catch (JwtException e) {
            return false;
        }
    }

    public String generateRefreshToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plus(7, ChronoUnit.DAYS);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("cs79-interactive-dashboard")
                .issuedAt(now)
                .expiresAt(expiry)
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("type", "refresh")
                .build();

        JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build();

        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
}
