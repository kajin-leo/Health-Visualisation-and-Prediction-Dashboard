package com.cs79_1.interactive_dashboard.DTO;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

public class WorkoutOverviewDTO {
    List<DailyWorkoutData> dataList;

    public WorkoutOverviewDTO(){
        dataList = new ArrayList<>();
    }

    public List<DailyWorkoutData> getDataList() {
        return dataList;
    }

    public void addData(DailyWorkoutData data){
        dataList.add(data);
    }
}
