package com.cs79_1.interactive_dashboard.DTO;

import java.time.DayOfWeek;

public class DailyWorkoutData {
    DayOfWeek dayOfWeek;
    int MVPA;
    int Light;

    public DailyWorkoutData(DayOfWeek dayOfWeek, int MVPA, int Light) {
        this.dayOfWeek = dayOfWeek;
        this.MVPA = MVPA;
        this.Light = Light;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public int getMVPA() {
        return MVPA;
    }

    public int getLight() {
        return Light;
    }

    public DailyWorkoutData addMVPA(int mVPA) {
        MVPA += mVPA;
        return this;
    }

    public DailyWorkoutData addLight(int light) {
        Light += light;
        return this;
    }

    public DailyWorkoutData setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
        return this;
    }
}
