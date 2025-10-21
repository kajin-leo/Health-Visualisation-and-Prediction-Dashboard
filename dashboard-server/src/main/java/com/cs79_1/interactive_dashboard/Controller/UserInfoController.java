package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.UserInfoResponse;
import com.cs79_1.interactive_dashboard.DTO.Avatar.AvatarResponseDTO;
import com.cs79_1.interactive_dashboard.Entity.User;
import com.cs79_1.interactive_dashboard.Security.JwtUtil;
import com.cs79_1.interactive_dashboard.Security.SecurityUtils;
import com.cs79_1.interactive_dashboard.Service.UserService;
import org.apache.catalina.security.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.context.support.SecurityWebApplicationContextUtils;
import org.springframework.web.bind.annotation.*;

import java.security.Security;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/")
public class UserInfoController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private final static Logger logger = LoggerFactory.getLogger(UserInfoController.class);

    @GetMapping("/info")
    public ResponseEntity<UserInfoResponse> getInfo(){
        Long userId = SecurityUtils.getCurrentUserId();
        try {
            User user = userService.getUserByUserId(userId).get();
            String username = user.getUsername();
            String firstName = user.getFirstName();
            String lastName = user.getLastName();
            if(firstName == null || firstName.isEmpty()) firstName = "Participant";
            if(lastName == null || lastName.isEmpty()) lastName = username.substring(6);
            String appearance = userService.getOrCreateUserPreference(userId).getAppearance().name();
            UserInfoResponse userInfoResponse = new UserInfoResponse(username, firstName, lastName, user.getAgeYear(), user.getSex(), user.getId(), appearance);

            logger.info("User {} fetched info", username);
            return ResponseEntity.ok(userInfoResponse);
        } catch (Exception e) {
            logger.error("Error fetching userinfo of userid {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/avatar")
    public ResponseEntity<AvatarResponseDTO> getAvatar() {
        Long userId = SecurityUtils.getCurrentUserId();
        try {
            User user = userService.getUserByUserId(userId).orElseThrow();
            AvatarResponseDTO dto = new AvatarResponseDTO(user.getId(), user.getAvatarUrl());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            logger.error("Error fetching avatar for user {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

}
