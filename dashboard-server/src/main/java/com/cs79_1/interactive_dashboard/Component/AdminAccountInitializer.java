package com.cs79_1.interactive_dashboard.Component;

import com.cs79_1.interactive_dashboard.Entity.User;
import com.cs79_1.interactive_dashboard.Enum.Role;
import com.cs79_1.interactive_dashboard.Repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class AdminAccountInitializer {
    private static final Logger logger = LoggerFactory.getLogger(AdminAccountInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RedisTemplate redisTemplate;

    @PostConstruct
    @Transactional
    public void initializeAdminAccount() {
        try {
            if (!checkIfAdminExists()) {
                logger.warn("No SUPERADMIN found. Creating default admin account...");
                createDefaultAdmin();
            } else {
                String adminUsername = getSuperadminUsername();
                String adminPassword = getSuperadminPassword();

                logger.info("Admin account already exists! Username: '{}' Password: '{}'", adminUsername, adminPassword);
            }

        } catch (Exception e) {
            logger.error("Error during admin account initialisation: ", e);
        }
    }

    private User createDefaultAdmin() {
        String randomSuffix = String.valueOf(System.currentTimeMillis() % 100000);
        String adminName = "admin_" + randomSuffix;
        Optional<User> existingUser = userRepository.findByUsername(adminName);

        if(existingUser.isPresent()) {
            String attemptedName = adminName;
            adminName = adminName + String.valueOf(System.currentTimeMillis() % 100000);
            logger.info("Admin already exists: {}, use {} instead! ", attemptedName, adminName);
        }

        User adminUser = new User();
        String adminPassword = generateRandomPassword();
        adminUser.setUsername(adminName);
        adminUser.setPassword(passwordEncoder.encode(adminPassword));
        adminUser.setFirstName("Super");
        adminUser.setLastName("Admin");
        adminUser.setRole(Role.SUPERADMIN);

        userRepository.save(adminUser);
        logger.warn("===============");
        logger.warn("Super Admin created with username '{}' and password '{}'", adminUser.getUsername(), adminPassword);
        logger.warn("===============");
        redisTemplate.opsForValue().set("superadmin:username", adminName);
        redisTemplate.opsForValue().set("superadmin:password", adminPassword);

        return adminUser;
    }

    private boolean checkIfAdminExists() {
        return userRepository.findByRole(Role.SUPERADMIN).size() > 0;
    }

    @Scheduled(fixedDelay = 300000)
    public void rollAdminPassword() {
        Optional<User> adminOptional = userRepository.findByUsername((String) redisTemplate.opsForValue().get("superadmin:username"));
        if(adminOptional.isPresent()) {
            String newPassword = generateRandomPassword();

            User admin = adminOptional.get();
            admin.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(admin);

            logger.info("Admin account rolled password: '{}', at {}", newPassword, LocalDateTime.now());
        }
    }

    private String generateRandomPassword() {
        return UUID.randomUUID().toString().substring(0, 24);
    }

    private String getSuperadminUsername() {
        return (String) redisTemplate.opsForValue().get("superadmin:username");
    }

    private String getSuperadminPassword() {
        return (String) redisTemplate.opsForValue().get("superadmin:password");
    }
}
