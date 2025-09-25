package com.cs79_1.interactive_dashboard.DTO.Workout;

import java.util.ArrayList;
import java.util.List;

public class WeeklyAggregatedHourDetails {
    String description;
    int count = 0;
    List<Integer> MVPA = new ArrayList<>();
    List<Integer> Light = new ArrayList<>();
    List<Long> ids = new ArrayList<>();
    List<Integer> daysOfWeek = new ArrayList<>();

    public WeeklyAggregatedHourDetails(int startHour) {
        this.description = String.format("%d:00-%d:00", startHour, startHour + 1);
    }

    public void addDay(int MVPA, int Light, Long id, int daysOfWeek) {
        this.MVPA.add(MVPA);
        this.Light.add(Light);
        this.ids.add(id);
        this.daysOfWeek.add(daysOfWeek);
        this.count++;
    }

    public int getMVPA(int dayIndex) {
        return MVPA.get(dayIndex);
    }

    public int getLight(int dayIndex) {
        return Light.get(dayIndex);
    }

    public String getDescription() {
        return description;
    }

    public int getDaysOfWeek(int dayIndex) {
        return daysOfWeek.get(dayIndex);
    }

    public int getCount() {
        return count;
    }
}
