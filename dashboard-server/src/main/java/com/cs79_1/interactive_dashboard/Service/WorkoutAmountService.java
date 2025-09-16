package com.cs79_1.interactive_dashboard.Service;

import com.cs79_1.interactive_dashboard.DTO.*;
import com.cs79_1.interactive_dashboard.Entity.WorkoutAmount;
import com.cs79_1.interactive_dashboard.Repository.WorkoutAmountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WorkoutAmountService {
    @Autowired
    private WorkoutAmountRepository workoutAmountRepository;

    List<WorkoutAmount> getWorkoutAmountByUserIdDesc(Long userId) {
        return workoutAmountRepository.findByUserIdOrderByDateTimeDesc(userId);
    }

    List<WorkoutAmount> getWorkoutAmountByUserIdAsc(Long userId) {
        return workoutAmountRepository.findByUserIdOrderByDateTimeAsc(userId);
    }

    public WorkoutOverviewDTO getOverview(Long userId) {
        List<WorkoutAmount> workoutAmounts = getWorkoutAmountByUserIdAsc(userId);
        WorkoutOverviewDTO overviewDTO = new WorkoutOverviewDTO();
        Map<DayOfWeek, DailyWorkoutData> dailyWorkoutDataMap = new HashMap<>();
        int aggregatedDaysCount = 0;
        DayOfWeek lastAggregatedDay = null;

        for(WorkoutAmount workoutAmount : workoutAmounts) {
            DayOfWeek dayOfWeek = workoutAmount.getDateTime().getDayOfWeek();
            int mvpa = workoutAmount.getSumSecondsMVPA3();
            int light = workoutAmount.getSumSecondsLight3();

            if (!dailyWorkoutDataMap.containsKey(dayOfWeek)) {
                if(lastAggregatedDay != null) {
                    overviewDTO.addData(dailyWorkoutDataMap.get(lastAggregatedDay));
                }

                DailyWorkoutData dailyWorkoutData = new DailyWorkoutData(dayOfWeek, mvpa, light);
                dailyWorkoutDataMap.put(dayOfWeek, dailyWorkoutData);
                aggregatedDaysCount++;
                lastAggregatedDay = dayOfWeek;
            } else {
                if(aggregatedDaysCount == 7 && lastAggregatedDay != dayOfWeek) {
                    break;
                }
                dailyWorkoutDataMap.get(dayOfWeek).addMVPA(mvpa).addLight(light);
            }
        }
        overviewDTO.addData(dailyWorkoutDataMap.get(lastAggregatedDay));

        return overviewDTO;
    }

    public WorkoutDailyDTO getDailyWorkoutDetail(Long userId, int requestedDayOfWeek) {
        List<WorkoutAmount> workoutAmounts = getWorkoutAmountByUserIdAsc(userId);
        WorkoutDailyDTO workoutDailyDTO = new WorkoutDailyDTO();
        boolean iteratedThroughRequestedDayOfWeek = false;

        for(WorkoutAmount workoutAmount : workoutAmounts) {
            DayOfWeek dayOfWeek = workoutAmount.getDateTime().getDayOfWeek();
            if(requestedDayOfWeek == dayOfWeek.getValue() - 1) {
                iteratedThroughRequestedDayOfWeek = true;
                int startingTime = workoutAmount.getDateTime().getHour();
                int mvpa =  workoutAmount.getSumSecondsMVPA3();
                int light = workoutAmount.getSumSecondsLight3();

                String segment = String.format("%d:00 - %d:00", startingTime, startingTime + 1);
                HourlyDailyWorkoutData data = new HourlyDailyWorkoutData(segment, mvpa, light);
                workoutDailyDTO.addData(data);
            } else {
                if(iteratedThroughRequestedDayOfWeek) {
                    break;
                }
            }
        }

        return workoutDailyDTO;
    }

    public WorkoutTimeOfDayDTO getTimeOfDay(Long userId, int requestedTimeOfDay) {
        List<WorkoutAmount> workoutAmounts = getWorkoutAmountByUserIdAsc(userId);
        WorkoutTimeOfDayDTO timeOfDayDTO = new WorkoutTimeOfDayDTO();

        boolean[] iterated = new boolean[7];

        for(WorkoutAmount workoutAmount : workoutAmounts) {
            if(requestedTimeOfDay != workoutAmount.getDateTime().getHour()) {
                continue;
            }

            DayOfWeek dayOfWeek = workoutAmount.getDateTime().getDayOfWeek();
            if(iterated[dayOfWeek.getValue() - 1]) {
                continue;
            }
            iterated[dayOfWeek.getValue() - 1] = true;

            int mvpa = workoutAmount.getSumSecondsMVPA3();
            int light = workoutAmount.getSumSecondsLight3();

            DailyWorkoutData data = new DailyWorkoutData(dayOfWeek, mvpa, light);
            timeOfDayDTO.addData(data);
        }

        return timeOfDayDTO;
    }
}
