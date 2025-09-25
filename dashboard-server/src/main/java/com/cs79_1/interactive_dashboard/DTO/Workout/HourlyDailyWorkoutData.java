package com.cs79_1.interactive_dashboard.DTO;

public class HourlyDailyWorkoutData {
    String timeSegmentStarting;
    int mvpa;
    int light;

    public HourlyDailyWorkoutData(String timeSegmentStarting, int mvpa, int light) {
        this.timeSegmentStarting = timeSegmentStarting;
        this.light = light;
        this.mvpa = mvpa;
    }

    public String getTimeSegmentStarting() {
        return timeSegmentStarting;
    }

    public int getMvpa() {
        return mvpa;
    }

    public int getLight() {
        return light;
    }
}
