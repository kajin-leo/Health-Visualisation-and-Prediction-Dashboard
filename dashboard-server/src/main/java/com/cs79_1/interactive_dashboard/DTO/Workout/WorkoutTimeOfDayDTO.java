package com.cs79_1.interactive_dashboard.DTO.Workout;

import java.util.ArrayList;
import java.util.List;

public class WorkoutTimeOfDayDTO {
    List<DailyWorkoutData> dataList;

    public WorkoutTimeOfDayDTO(){
        dataList = new ArrayList<>();
    }

    public List<DailyWorkoutData> getDataList() {
        return dataList;
    }

    public void addData(DailyWorkoutData data){
        dataList.add(data);
    }
}
