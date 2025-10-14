package com.cs79_1.interactive_dashboard.DTO.Simulation;

public class HeatmapTaskResponse {
    long userId;
    Object probs;
    Object mvpa_impact;
    Object light_impact;

    public HeatmapTaskResponse() {
    }

    public HeatmapTaskResponse(long userId, Object probs, Object mvpa_impact, Object light_impact) {
        this.userId = userId;
        this.probs = probs;
        this.mvpa_impact = mvpa_impact;
        this.light_impact = light_impact;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public Object getProbs() {
        return probs;
    }

    public void setProbs(Object probs) {
        this.probs = probs;
    }

    public Object getMvpa_impact() {
        return mvpa_impact;
    }

    public void setMvpa_impact(Object mvpa_impact) {
        this.mvpa_impact = mvpa_impact;
    }

    public Object getLight_impact() {
        return light_impact;
    }

    public void setLight_impact(Object light_impact) {
        this.light_impact = light_impact;
    }
}
