package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.Security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    @GetMapping("/heatmap")
    public ResponseEntity<?> getHeatmap() {
        long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok().build();
    }
}
