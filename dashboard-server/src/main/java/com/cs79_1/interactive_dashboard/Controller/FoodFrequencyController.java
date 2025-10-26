package com.cs79_1.interactive_dashboard.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.cs79_1.interactive_dashboard.DTO.FoodFrequencyRequest;
import com.cs79_1.interactive_dashboard.Service.FoodFrequencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/survey")
public class FoodFrequencyController {

    @Autowired
    private FoodFrequencyService foodFrequencyService;

    @PostMapping("/ffq")
    public ResponseEntity<?> saveFoodFrequency(@RequestBody FoodFrequencyRequest request) {
        try {
            foodFrequencyService.saveFoodFrequency(request);
            return ResponseEntity.ok().body("{\"message\": \"Survey saved successfully\"}");
        } catch (JsonProcessingException e) {
            return ResponseEntity.internalServerError()
                    .body("{\"error\": \"Failed to process JSON\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("{\"error\": \"Unexpected server error\"}");
        }
    }
}
