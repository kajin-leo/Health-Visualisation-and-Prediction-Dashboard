package com.cs79_1.interactive_dashboard.DTO;

public class SleepSummary {
    private int thisWeekAvgMin;
    private double schoolNightAvgHrs;
    private double weekendNightAvgHrs;

    public int getThisWeekAvgMin() {
        return thisWeekAvgMin;
    }

    public void setThisWeekAvgMin(int thisWeekAvgMin) {
        this.thisWeekAvgMin = thisWeekAvgMin;
    }

    public double getSchoolNightAvgHrs() {
        return schoolNightAvgHrs;
    }

    public void setSchoolNightAvgHrs(double schoolNightAvgHrs) {
        this.schoolNightAvgHrs = schoolNightAvgHrs;
    }

    public double getWeekendNightAvgHrs() {
        return weekendNightAvgHrs;
    }

    public void setWeekendNightAvgHrs(double weekendNightAvgHrs) {
        this.weekendNightAvgHrs = weekendNightAvgHrs;
    }
}
