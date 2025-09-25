package com.cs79_1.interactive_dashboard.DTO.Workout;

import java.util.LinkedHashMap;
import java.util.Map;

public class WorkoutHeatmapDTO {

    private Map<Integer, Map<String, Double>> mvpaHeatmap = new LinkedHashMap<>();
    private Map<Integer, Map<String, Double>> lightHeatmap = new LinkedHashMap<>();

    public void addData(int hour, String binLabel, double mvpaAvg, double lightAvg) {
        mvpaHeatmap
                .computeIfAbsent(hour, k -> new LinkedHashMap<>())
                .put(binLabel, mvpaAvg);
        lightHeatmap
                .computeIfAbsent(hour, k -> new LinkedHashMap<>())
                .put(binLabel, lightAvg);
    }

    public Map<Integer, Map<String, Double>> getMvpaHeatmap() {
        return mvpaHeatmap;
    }

    public Map<Integer, Map<String, Double>> getLightHeatmap() {
        return lightHeatmap;
    }
}
