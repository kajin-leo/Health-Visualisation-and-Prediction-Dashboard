package com.cs79_1.interactive_dashboard.Enum;


public enum HFZClassification {
    HFZ("Healthy Fitness Zone"),
    NI("Needs Improvement"),
    NIHR("Needs Improvement - Hight Risk"),
    VL("Very Lean");

    private String description;

    HFZClassification(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
