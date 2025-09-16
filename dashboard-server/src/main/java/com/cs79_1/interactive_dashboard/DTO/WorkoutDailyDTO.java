package com.cs79_1.interactive_dashboard.DTO;

import java.util.ArrayList;
import java.util.List;

public class WorkoutDailyDTO {
    List<HourlyDailyWorkoutData> dataList;

    public WorkoutDailyDTO() {
        this.dataList = new ArrayList<>();
    }

    public List<HourlyDailyWorkoutData> getDataList() { return dataList; }

    public void addData(HourlyDailyWorkoutData data){
        dataList.add(data);
    }

}
