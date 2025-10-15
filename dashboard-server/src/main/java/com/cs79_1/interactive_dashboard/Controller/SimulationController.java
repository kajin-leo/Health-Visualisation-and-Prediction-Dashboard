package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.Simulation.*;
import com.cs79_1.interactive_dashboard.DTO.Workout.WeeklyAggregatedHourDetails;
import com.cs79_1.interactive_dashboard.Security.SecurityUtils;
import com.cs79_1.interactive_dashboard.Service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

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

    @Autowired
    SseService sseService;

    private static final Logger logger = LoggerFactory.getLogger(SimulationController.class);
    @Autowired
    private SimulationService simulationService;

    @GetMapping("/heatmap")
    public ResponseEntity<?> getHeatmap() {
        long userId = SecurityUtils.getCurrentUserId();
        try {
            if (simulationService.getHeatmap(userId) == null) {
                String taskId = simulationService.getOrCreateHeatmapTask(userId);
                HeatmapQueryResponseDTO dto = new HeatmapQueryResponseDTO(null, false, taskId);
                return ResponseEntity.ok(dto);
            } else {
                Object heatmap = simulationService.getHeatmap(userId);
                HeatmapQueryResponseDTO dto = new HeatmapQueryResponseDTO(heatmap, true, null);
                return ResponseEntity.ok(dto);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/chart")
    public ResponseEntity<StructuredActivityDTO> getChart(@RequestParam(defaultValue = "false") boolean isWeekend) {
        long userId = SecurityUtils.getCurrentUserId();
        try {
            List<WeeklyAggregatedHourDetails> weeklyAggregatedHourDetails = workoutAmountService.getStructuredWorkoutDetailFromRedis(userId);
            StructuredActivityDTO structuredActivityDTO = workoutAmountService.getStructuredActivityData(weeklyAggregatedHourDetails, isWeekend);
            return ResponseEntity.ok(structuredActivityDTO);
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

    @PostMapping("/predict")
    public ResponseEntity<String> predict(@RequestBody PredictionRequestDTO request) {
        long userId = SecurityUtils.getCurrentUserId();
        try {
            AlteredActivityPredictionRequest predictionRequest = new AlteredActivityPredictionRequest(userId, !request.isWeekend());
            StructuredActivityDTO structuredActivityDTO = workoutAmountService.getStructuredActivityData(userId, request.isWeekend());
            for(int i = 0; i < 24; i++) {
                double mvpaScale = (double)request.getMvpa()[i] / structuredActivityDTO.getMVPA().get(i);
                double lightScale = (double)request.getLight()[i] / structuredActivityDTO.getLight().get(i);
                predictionRequest.addMVPA(i, mvpaScale);
                predictionRequest.addLight(i, lightScale);
            }

//            PredictionResultDTO result = flaskAPIService.sendPredictionRequest(predictionRequest).getBody();
            String taskId = simulationService.createPredictionTask(userId, predictionRequest);
            return ResponseEntity.ok(taskId);
        } catch (Exception e) {
            logger.error("Error fetching simulation chart data for user {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/stream/{taskId}")
    public SseEmitter stream(@PathVariable String taskId) {
        SseEmitter emitter = sseService.getOrRegisterEmitter(taskId);
        return emitter;
    }
}
