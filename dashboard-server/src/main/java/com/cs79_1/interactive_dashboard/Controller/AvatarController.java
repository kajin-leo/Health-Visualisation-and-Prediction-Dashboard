package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.Service.AvatarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/avatar")
public class AvatarController {

    @Autowired
    private AvatarService avatarService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        try {
            String avatarUrl = avatarService.saveAvatar(file, userId);
            return ResponseEntity.ok().body(
                    java.util.Map.of("avatarUrl", avatarUrl)
            );
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
