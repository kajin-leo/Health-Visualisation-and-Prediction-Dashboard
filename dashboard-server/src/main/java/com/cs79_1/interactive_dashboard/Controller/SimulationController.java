package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.Simulation.SimulatedActivityDTO;
import com.cs79_1.interactive_dashboard.DTO.Workout.WeeklyAggregatedHourDetails;
import com.cs79_1.interactive_dashboard.Security.SecurityUtils;
import com.cs79_1.interactive_dashboard.Service.FlaskAPIService;
import com.cs79_1.interactive_dashboard.Service.StaticInfoService;
import com.cs79_1.interactive_dashboard.Service.WorkoutAmountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {
    @Autowired
    FlaskAPIService flaskAPIService;

    @Autowired
    WorkoutAmountService workoutAmountService;

    @Autowired
    StaticInfoService staticInfoService;

    private static final Logger logger = LoggerFactory.getLogger(SimulationController.class);

    @GetMapping("/heatmap")
    public ResponseEntity<?> getHeatmap() {
        long userId = SecurityUtils.getCurrentUserId();
        try {
            Object response = flaskAPIService.getHeatmap(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }

    }

    @GetMapping("/chart")
    public ResponseEntity<SimulatedActivityDTO> getChart(@RequestParam(defaultValue = "false") boolean isWeekend) {
        long userId = SecurityUtils.getCurrentUserId();
        try {
            List<WeeklyAggregatedHourDetails> weeklyAggregatedHourDetails = workoutAmountService.resetOrganisedWorkoutDetailInRedis(userId);
            SimulatedActivityDTO simulatedActivityDTO = workoutAmountService.getSimulatedActivity(weeklyAggregatedHourDetails, isWeekend);
            return ResponseEntity.ok(simulatedActivityDTO);
        }  catch (Exception e) {
            logger.error("Error fetching simulation chart data, {}\n{}", e.getMessage(), e.getStackTrace());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/groundtruth")
    public ResponseEntity<String>  getGroundtruth() {
        long userId = SecurityUtils.getCurrentUserId();
        try {
            String classification = staticInfoService.getHFZClassification(userId);
            return ResponseEntity.ok(classification);
        } catch (Exception e) {
           logger.error("Error fetching ground truth classification for user {}", userId, e);
           return ResponseEntity.internalServerError().build();
        }
    }
}
