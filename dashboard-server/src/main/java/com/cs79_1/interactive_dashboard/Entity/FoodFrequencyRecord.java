package com.cs79_1.interactive_dashboard.Entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_frequency_records")
public class FoodFrequencyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(columnDefinition = "TEXT")
    private String foodFrequencyJson;

    @Column(columnDefinition = "TEXT")
    private String servingsJson;

    private LocalDateTime createdAt;

    public FoodFrequencyRecord() {}

    public FoodFrequencyRecord(Long userId, String foodFrequencyJson, String servingsJson) {
        this.userId = userId;
        this.foodFrequencyJson = foodFrequencyJson;
        this.servingsJson = servingsJson;
        this.createdAt = LocalDateTime.now();
    }

    // Getters / Setters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFoodFrequencyJson() { return foodFrequencyJson; }
    public void setFoodFrequencyJson(String foodFrequencyJson) { this.foodFrequencyJson = foodFrequencyJson; }
    public String getServingsJson() { return servingsJson; }
    public void setServingsJson(String servingsJson) { this.servingsJson = servingsJson; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
