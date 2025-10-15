package com.cs79_1.interactive_dashboard.Service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DietRecommendationService {

    public Map<String, Double> getRecommendations(int age_year, int sex, String goal) {
        Map<String, Double> rec = new HashMap<>();

        if (sex == 1) { // Male
            if (age_year >= 9 && age_year <= 11) {
                rec.put("Vegetables", 5 * 75.0);   // 375 g
                rec.put("Fruit", 2 * 150.0);       // 300 g
                rec.put("Grains", 5 * 75.0);       // 375 g
                rec.put("Meat", 2.5 * 65.0);       // 162.5 g
                rec.put("Dairy", 2.5 * 250.0);     // 625 g
            } else if (age_year >= 12 && age_year <= 13) {
                rec.put("Vegetables", 5.5 * 75.0); // 412.5 g
                rec.put("Fruit", 2 * 150.0);       // 300 g
                rec.put("Grains", 6 * 75.0);       // 450 g
                rec.put("Meat", 2.5 * 65.0);       // 162.5 g
                rec.put("Dairy", 3.5 * 250.0);     // 875 g
            } else if (age_year >= 14 && age_year <= 18) {
                rec.put("Vegetables", 5.5 * 75.0); // 412.5 g
                rec.put("Fruit", 2 * 150.0);       // 300 g
                rec.put("Grains", 7 * 75.0);       // 525 g
                rec.put("Meat", 2.5 * 65.0);       // 162.5 g
                rec.put("Dairy", 3.5 * 250.0);     // 875 g
            }
        } else if (sex == 2) { // Female
            if (age_year >= 9 && age_year <= 11) {
                rec.put("Vegetables", 5 * 75.0);   // 375 g
                rec.put("Fruit", 2 * 150.0);       // 300 g
                rec.put("Grains", 4 * 75.0);       // 300 g
                rec.put("Meat", 2.5 * 65.0);       // 162.5 g
                rec.put("Dairy", 3 * 250.0);       // 750 g
            } else if (age_year >= 12 && age_year <= 13) {
                rec.put("Vegetables", 5 * 75.0);   // 375 g
                rec.put("Fruit", 2 * 150.0);       // 300 g
                rec.put("Grains", 5 * 75.0);       // 375 g
                rec.put("Meat", 2.5 * 65.0);       // 162.5 g
                rec.put("Dairy", 3.5 * 250.0);     // 875 g
            } else if (age_year >= 14 && age_year <= 18) {
                rec.put("Vegetables", 5 * 75.0);   // 375 g
                rec.put("Fruit", 2 * 150.0);       // 300 g
                rec.put("Grains", 7 * 75.0);       // 525 g
                rec.put("Meat", 2.5 * 65.0);       // 162.5 g
                rec.put("Dairy", 3.5 * 250.0);     // 875 g
            }
        }
        if (goal != null && !goal.isEmpty()) {
            switch (goal.toLowerCase()) {
                case "lean":
                case "lean muscle building":
                    // Slightly higher protein and veg, slightly lower grains
                    scale(rec, "Meat", 1.15);
                    scale(rec, "Vegetables", 1.10);
                    scale(rec, "Grains", 0.9);
                    break;

                case "cutting":
                case "weight loss":
                    // Lower dairy and grains, higher vegetables
                    scale(rec, "Vegetables", 1.2);
                    scale(rec, "Grains", 0.85);
                    scale(rec, "Dairy", 0.85);
                    scale(rec, "Meat", 0.95);
                    break;

                case "bulking":
                case "strength gain":
                    // Higher overall calories — raise all slightly
                    rec.replaceAll((k, v) -> v * 1.15);
                    break;

                case "balanced":
                default:
                    // Keep base recommendations unchanged
                    break;
            }
        }

        return rec;
    }

    private void scale(Map<String, Double> rec, String key, double factor) {
        if (rec.containsKey(key)) {
            rec.put(key, rec.get(key) * factor);
        }
    }
}
