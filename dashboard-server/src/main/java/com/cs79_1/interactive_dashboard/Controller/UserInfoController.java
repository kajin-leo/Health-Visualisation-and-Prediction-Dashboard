package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.UserInfoResponse;
import com.cs79_1.interactive_dashboard.Entity.User;
import com.cs79_1.interactive_dashboard.Service.JwtService;
import com.cs79_1.interactive_dashboard.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user/")
public class UserInfoController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    private final static Logger logger = LoggerFactory.getLogger(UserInfoController.class);

    @GetMapping("/info")
    public ResponseEntity<UserInfoResponse> getInfo(@RequestHeader("Authorization") String token){
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            long userId = jwtService.extractUserId(token);
            Optional<User> userOptional = userService.getUserByUserId(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            User user = userOptional.get();
            String username = user.getUsername();
            String firstName = user.getFirstName();
            String lastName = user.getLastName();
            if(firstName == null || firstName.isEmpty()) firstName = "Participant";
            if(lastName == null || lastName.isEmpty()) lastName = username.substring(6);
            UserInfoResponse userInfoResponse = new UserInfoResponse(username, firstName, lastName);

            logger.info("User {} fetched info", username);
            return ResponseEntity.ok(userInfoResponse);
        } catch (Exception e) {
            logger.error("Error fetching userinfo of token {}: ", token, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
