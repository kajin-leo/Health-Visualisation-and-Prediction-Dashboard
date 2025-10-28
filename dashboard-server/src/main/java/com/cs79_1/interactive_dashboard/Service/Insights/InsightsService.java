package com.cs79_1.interactive_dashboard.Service.Insights;

import com.cs79_1.interactive_dashboard.DTO.BodyCompositionSummary;
import com.cs79_1.interactive_dashboard.DTO.Insights.ComprehensiveInsightsDTO;
import com.cs79_1.interactive_dashboard.DTO.Workout.DailyWorkoutData;
import com.cs79_1.interactive_dashboard.DTO.Workout.HourlyDailyWorkoutData;
import com.cs79_1.interactive_dashboard.Entity.BodyComposition;
import com.cs79_1.interactive_dashboard.Entity.BodyMetrics;
import com.cs79_1.interactive_dashboard.Entity.User;
import com.cs79_1.interactive_dashboard.Entity.WeeklyIntake;
import com.cs79_1.interactive_dashboard.Exception.UserNotExistException;
import com.cs79_1.interactive_dashboard.Service.RedisService;
import com.cs79_1.interactive_dashboard.Service.SseService;
import com.cs79_1.interactive_dashboard.Service.UserService;
import com.cs79_1.interactive_dashboard.Service.WorkoutAmountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class InsightsService {
    private final InsightsAgent insightsAgent;
    private final WorkoutAmountService workoutAmountService;
    private final UserService userService;
    private final RedisService redisService;
    private final SseService sseService;
    private Map<Long, Boolean> insightsUndergeneratingRegistration;

    public ComprehensiveInsightsDTO analyseHealthData(User user) {
        String activitiesAnalysis = insightsAgent.analyseActivitiesData(formatActivitiesData(workoutAmountService.getAveragedTimeSegmentedData(user.getId())));
        String bodyInfoAnalysis = insightsAgent.analyseBodyData(formatBodyInfoData(user));
        String bioEAnalysis = insightsAgent.analyzeBioelectricalData(formatBioEData(user));
        String intakeAnalysis = insightsAgent.analyzeDietData(formatDietaryData(user));

        String allAnalyses = String.format("""
                Activities Analysis: %s,
                Body Information: %s,
                Bioelectrical Data: %s,
                Dietary Intake Data: %s,
                """, activitiesAnalysis, bodyInfoAnalysis, bioEAnalysis, intakeAnalysis);

        String comprehensiveInsights = insightsAgent.generateComprehensiveAdvice(allAnalyses);

        ComprehensiveInsightsDTO dto = new ComprehensiveInsightsDTO();
        dto.setActivitiesAnalysis(activitiesAnalysis);
        dto.setBodyInfoAnalysis(bodyInfoAnalysis);
        dto.setBioEAnalysis(bioEAnalysis);
        dto.setIntakeAnalysis(intakeAnalysis);
        dto.setOverallInsights(comprehensiveInsights);

        return dto;
    }

    private String formatActivitiesData(Map<DayOfWeek, Map<Integer, DailyWorkoutData>> aggregatedData) {
        List<String> formattedActivities = new ArrayList<>();
        for(DayOfWeek dayOfWeek : DayOfWeek.values()) {
            if (!aggregatedData.containsKey(dayOfWeek)) { continue;}

            String dailyActivities = dayOfWeek.name() + ": \n";
            Map<Integer, DailyWorkoutData> dailyWorkoutData = aggregatedData.get(dayOfWeek);

            for(int i = 0; i < 24; i++) {
                if (!dailyWorkoutData.containsKey(i)) { continue;}
                dailyActivities += String.format(
                        "Time: %d - %d, MVPA Seconds: %d, Light Activities Seconds: %d \n",
                        i, i + 1,
                        dailyWorkoutData.get(i).getMVPA(),
                        dailyWorkoutData.get(i).getLight()
                );
            }

            formattedActivities.add(dailyActivities);
        }

        return String.join("\n", formattedActivities);
    }

    private String formatBodyInfoData(User user) {
        BodyComposition bodyComposition = user.getBodyComposition();
        BodyMetrics bodyMetrics = user.getBodyMetrics();

        String bodyInfo = "";
        if (user.getAgeYear() != 0) {
            bodyInfo += "Age: " + user.getAgeYear() + "\n";
        }

        if (bodyMetrics != null) {
            bodyInfo += String.format("Height: %.2f, Weight: %.2f \n", bodyMetrics.getHeight(), bodyMetrics.getWeight());
        }

        if (bodyComposition != null) {
            bodyInfo += String.format("BMI: %.0f, Body Fat Percentage: %.2f, Body Water Percentage: %.2f, Body Muscle Amount: %.2f", bodyComposition.getBMI(), bodyComposition.getFatPercentage(), bodyComposition.getWaterPercentage(), bodyComposition.getMuscleAmount());
        }

        return bodyInfo;
    }

    private String formatBioEData(User user) {
        BodyComposition bodyComposition = user.getBodyComposition();
        if (bodyComposition != null) {
            String bioE = String.format("Bioelectrical Resistance 6.25khz: %f.1, Bioelectrical Reactance 6.25khz: %f.1, Bioelectrical Resistance 50khz: %f.1, Bioelectrical Reactance 50khz: %f.1", bodyComposition.getWlgr625(), bodyComposition.getWlgx625(), bodyComposition.getWlgr50(), bodyComposition.getWlgx50());
            return bioE;
        }

        return "No enough data, please skip this. ";
    }

    private String formatDietaryData(User user) {
        WeeklyIntake weeklyIntake = user.getWeeklyIntake();
        if (weeklyIntake != null) {
            String intake = String.format("""
                    Cereal: %.2f
                    Vegetables and Legumes: %.2f
                    Fruit: %.2f
                    Dairy: %.2f
                    Fats and Oils: %.2f
                    Meat, Fish, Poultry or Eggs:%.2f,
                    Water: %.2f""",
                    weeklyIntake.getCereals(),
                    weeklyIntake.getVegetablesAndLegumes(),
                    weeklyIntake.getFruit(),
                    weeklyIntake.getDairy(),
                    weeklyIntake.getFatsOils(),
                    weeklyIntake.getMeatFishPoultryEggs(),
                    weeklyIntake.getWater());

            return intake;
        }

        return "No enough data, please skip this. ";
    }

    public ComprehensiveInsightsDTO getInsightsFromRedis(long userId) {
        String redisKey = "insights::" + userId;
        ComprehensiveInsightsDTO cachedDTO = redisService.getObject(redisKey, ComprehensiveInsightsDTO.class);

        return cachedDTO;
    }

    @Async
    public void createInsights(long userId, String taskId) {
        User user = userService.getUserByUserId(userId).orElseThrow(UserNotExistException::new);
        ComprehensiveInsightsDTO insightsDTO = analyseHealthData(user);

        String redisKey = "insights::" + user.getId();
        redisService.saveWithExpire(redisKey, insightsDTO, 30, TimeUnit.MINUTES);
        sseService.sendResult(taskId, insightsDTO);
        clearInsightsTask(user.getId());
    }

    public String createInsightsGenerationTask(long userId) {
        User user = userService.getUserByUserId(userId).orElseThrow(UserNotExistException::new);
        String redisKey = "insights_task::" + userId;
        String taskId = redisService.getObject(redisKey, String.class);
        if (taskId != null) {
            return taskId;
        }

        taskId = UUID.randomUUID().toString();

        return taskId;
    }

    public boolean clearInsightsTask(long userId) {
        String redisKey = "insights_task::" + userId;
        try {
            redisService.delete(redisKey);
        } catch (Exception e) {
            return false;
        }

        return true;
    }
}
