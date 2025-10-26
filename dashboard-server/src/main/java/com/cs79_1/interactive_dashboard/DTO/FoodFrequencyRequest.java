package com.cs79_1.interactive_dashboard.DTO;


import java.util.Map;

public class FoodFrequencyRequest {
    private Long userId;
    private Map<String, String> foodFrequency;
    private Map<String, Double> servings;

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Map<String, String> getFoodFrequency() {
        return foodFrequency;
    }
    public void setFoodFrequency(Map<String, String> foodFrequency) {
        this.foodFrequency = foodFrequency;
    }

    public Map<String, Double> getServings() {
        return servings;
    }
    public void setServings(Map<String, Double> servings) {
        this.servings = servings;
    }
}
