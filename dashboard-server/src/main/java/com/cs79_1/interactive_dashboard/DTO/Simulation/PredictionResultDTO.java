package com.cs79_1.interactive_dashboard.DTO.Simulation;

public class PredictionResultDTO {
    String classification;
    double probability;
    String taskId;

    public PredictionResultDTO() {
    }

    public PredictionResultDTO(String classification, double probability, String taskId) {
        this.classification = classification;
        this.probability = probability;
        this.taskId = taskId;
    }

    public String getClassification() {
        return classification;
    }

    public void setClassification(String classification) {
        this.classification = classification;
    }

    public double getProbability() {
        return probability;
    }

    public void setProbability(double probability) {
        this.probability = probability;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }
}
