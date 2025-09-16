package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.WorkoutDailyDTO;
import com.cs79_1.interactive_dashboard.DTO.WorkoutTimeOfDayDTO;
import com.cs79_1.interactive_dashboard.Security.SecurityUtils;
import com.cs79_1.interactive_dashboard.Service.WorkoutAmountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/workout")
public class WorkoutAmountController {
    @Autowired
    WorkoutAmountService workoutAmountService;

    private static final Logger logger = LoggerFactory.getLogger(WorkoutAmountController.class);

    @GetMapping("/daily/{dayOfWeek}")
    public ResponseEntity<WorkoutDailyDTO> dailyDetail(@PathVariable int dayOfWeek) {
        if(dayOfWeek < 0 || dayOfWeek > 6) {return new ResponseEntity<>(HttpStatus.BAD_REQUEST);}
        long userId = SecurityUtils.getCurrentUserId();
        try {
            WorkoutDailyDTO dto = workoutAmountService.getDailyWorkoutDetail(userId, dayOfWeek);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            logger.error("Failed to get daily workout detail for {} at {}: ", userId, dayOfWeek, e);
            return ResponseEntity.internalServerError().build();
        }

    }

    @GetMapping("/timeofday/{time}")
    public ResponseEntity<WorkoutTimeOfDayDTO> timeOfDayDetail(@PathVariable int time){
        if(time < 0 || time > 23) {return new ResponseEntity<>(HttpStatus.BAD_REQUEST);}
        long userId = SecurityUtils.getCurrentUserId();
        try {
            WorkoutTimeOfDayDTO dto = workoutAmountService.getTimeOfDay(userId, time);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            logger.error("Failed to get daily workout time for {} at {}: ", userId, time, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/timeofday/all")
    public ResponseEntity<WorkoutTimeOfDayDTO[]> allTimeOfDayDetail(){
        long userId = SecurityUtils.getCurrentUserId();
        List<WorkoutTimeOfDayDTO> list = new ArrayList<>();
        try {
            for(int i = 0; i < 24; i++) {
                WorkoutTimeOfDayDTO dto = workoutAmountService.getTimeOfDay(userId, i);
                list.add(dto);
            }
            return ResponseEntity.ok(list.toArray(new WorkoutTimeOfDayDTO[0]));
        }  catch (Exception e) {
            logger.error("Failed to get daily workout time for {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
