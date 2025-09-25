package com.cs79_1.interactive_dashboard.DTO.Workout;

import java.util.ArrayList;
import java.util.List;

public class SimulatedActivityDTO {
    List<Integer> MVPA;
    List<Integer> Light;
    List<String> description;

    public SimulatedActivityDTO() {
        MVPA = new ArrayList<>();
        Light = new ArrayList<>();
        description = new ArrayList<>();
    }

    public void addMVPA(int MVPA) {
        this.MVPA.add(MVPA);
    }

    public void addLight(int Light) {
        this.Light.add(Light);
    }

    public void addDescription(String description) {
        this.description.add(description);
    }

    public List<Integer> getMVPA() {
        return MVPA;
    }

    public List<Integer> getLight() {
        return Light;
    }

    public List<String> getDescription() {
        return description;
    }
}
