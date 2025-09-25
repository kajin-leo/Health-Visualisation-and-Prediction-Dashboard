package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.*;
import com.cs79_1.interactive_dashboard.DTO.DietaryIntake.FoodIntakeResultDto;
import com.cs79_1.interactive_dashboard.DTO.Workout.WorkoutOverviewDTO;
import com.cs79_1.interactive_dashboard.Security.SecurityUtils;
import com.cs79_1.interactive_dashboard.Service.StaticInfoService;
import com.cs79_1.interactive_dashboard.Service.StaticInfoService.FoodIntakeService;

import java.util.HashMap;
import java.util.Map;

import com.cs79_1.interactive_dashboard.Service.WorkoutAmountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/api/static")
public class StaticInfoController {
    @Autowired
    private StaticInfoService staticInfoService;

    @Autowired
    private WorkoutAmountService workoutAmountService;

    private static final Logger logger = LoggerFactory.getLogger(StaticInfoController.class);

    @GetMapping("/weight-metrics")
    public ResponseEntity<?> getWeightMetricsZScore() {
        long userId = SecurityUtils.getCurrentUserId();

        try {
            double[] l = staticInfoService.getFourDimensionalL(userId);
            double[] m = staticInfoService.getFourDimensionalM(userId);
            double[] s = staticInfoService.getFourDimensionalS(userId);
            double[] z = staticInfoService.getFourDimensionalZScores(userId);
            double[] percentile = staticInfoService.getFourDimensionalPercentile(userId);
            String[] classification = staticInfoService.getFourDimensionalClassification(userId);
            WeightStatus weightStatus = new WeightStatus();

            weightStatus.setIotfL(l[0]);
            weightStatus.setIotfM(m[0]);
            weightStatus.setIotfS(s[0]);
            weightStatus.setIotfZ(z[0]);
            weightStatus.setIotfP(percentile[0]);
            weightStatus.setIotfC(classification[0]);

            weightStatus.setCacheraL(l[1]);
            weightStatus.setCacheraM(m[1]);
            weightStatus.setCacheraS(s[1]);
            weightStatus.setCacheraZ(z[1]);
            weightStatus.setCacheraP(percentile[1]);
            weightStatus.setCacheraC(classification[1]);

            weightStatus.setOmsL(l[2]);
            weightStatus.setOmsM(m[2]);
            weightStatus.setOmsS(s[2]);
            weightStatus.setOmsZ(z[2]);
            weightStatus.setOmsP(percentile[2]);
            weightStatus.setOmsC(classification[2]);

            weightStatus.setCdcL(l[3]);
            weightStatus.setCdcM(m[3]);
            weightStatus.setCdcS(s[3]);
            weightStatus.setCdcZ(z[3]);
            weightStatus.setCdcP(percentile[3]);
            weightStatus.setCdcC(classification[3]);

            return ResponseEntity.ok(weightStatus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No such user id");
        }
    }
    @GetMapping("/sleep-summary")
    public ResponseEntity<SleepSummary> getSleepSummary() {
        long userId = SecurityUtils.getCurrentUserId();

        double school = staticInfoService.getSchoolNightAvgHours(userId);
        double weekend = staticInfoService.getWeekendNightAvgHours(userId);
        double week = staticInfoService.getTotalWeekHours(userId);

        int thisWeekAvgMin = (int) Math.round((week / 7.0) * 60.0);

        SleepSummary dto = new SleepSummary();
        dto.setThisWeekAvgMin(thisWeekAvgMin);
        dto.setSchoolNightAvgHrs(school);
        dto.setWeekendNightAvgHrs(weekend);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/body-composition")
    public ResponseEntity<BodyCompositionSummary> getBodyComposition() {
        long userId = SecurityUtils.getCurrentUserId();
        BodyCompositionSummary dto = staticInfoService.getBodyCompositionSummary(userId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/body-composition/wlgr-wlgx")
    public ResponseEntity<Map<String, Double>> getWlgrWlgx() {
        long userId = SecurityUtils.getCurrentUserId();
        BodyCompositionSummary dto = staticInfoService.getBodyCompositionSummary(userId);

        Map<String, Double> result = new HashMap<>();
        result.put("wlgr625", dto.getWlgr625());
        result.put("wlgr50", dto.getWlgr50());
        result.put("wlgx625", dto.getWlgx625());
        result.put("wlgx50", dto.getWlgx50());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/workout-overview")
    public ResponseEntity<WorkoutOverviewDTO>  getWorkoutOverview() {
        long userId = SecurityUtils.getCurrentUserId();
        try {
            WorkoutOverviewDTO dto = workoutAmountService.getOverview(userId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/bodymetrics-overview")
    public ResponseEntity<BodyMetricsSummaryDTO> getBodyMetricsSummary() {
        long userId = SecurityUtils.getCurrentUserId();
        try {
            BodyMetricsSummaryDTO dto = staticInfoService.getBodyMetricsSummary(userId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            logger.error("Error fetching body metrics summary for user {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @RestController
    @RequestMapping("/api/food-intake")
    public class FoodIntakeController {

        @GetMapping("/food-intake")
        public ResponseEntity<FoodIntakeResultDto> getFoodIntake() {
            long userId = SecurityUtils.getCurrentUserId();
            FoodIntakeResultDto dto = foodIntakeService.calculateFoodIntake(userId);
            return ResponseEntity.ok(dto);
        }
        @Autowired
        private FoodIntakeService foodIntakeService;

        @GetMapping("/rings")
        public FoodIntakeResultDto getFoodIntakeRings() {
            long userId = SecurityUtils.getCurrentUserId();
            return foodIntakeService.calculateFoodIntake(userId);
        }


    }
}
