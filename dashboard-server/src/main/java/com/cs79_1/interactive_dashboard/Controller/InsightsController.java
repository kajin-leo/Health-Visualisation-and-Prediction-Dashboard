package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.Insights.ComprehensiveInsightsDTO;
import com.cs79_1.interactive_dashboard.DTO.Insights.InsightsGenerationResponse;
import com.cs79_1.interactive_dashboard.Exception.UserNotExistException;
import com.cs79_1.interactive_dashboard.Security.SecurityUtils;
import com.cs79_1.interactive_dashboard.Service.Insights.InsightsService;
import com.cs79_1.interactive_dashboard.Service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightsController {
    private final InsightsService insightsService;
    private final SseService sseService;

    @GetMapping
    public ResponseEntity<?> getInsights() {
        long userId = SecurityUtils.getCurrentUserId();

        try {
            ComprehensiveInsightsDTO dto = insightsService.getInsightsFromRedis(userId);
            InsightsGenerationResponse response = new InsightsGenerationResponse();
            if (dto == null) {
                String taskId = insightsService.createInsightsGenerationTask(userId);
                response.setInsights(null);
                response.setCached(false);
                response.setTaskId(taskId);
                insightsService.createInsights(userId, taskId);
            } else {
                response.setInsights(dto);
                response.setCached(true);
                response.setTaskId(null);
            }

            return ResponseEntity.ok(response);
        } catch (UserNotExistException e) {
            return ResponseEntity.badRequest().body("User not exist");
        } catch (Exception e) {
            log.error("Error getting insights for user {}, error message: {} from {}, \n{}", userId, e.getMessage(), e.getCause(), e.getStackTrace());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/stream/{taskId}")
    public SseEmitter stream(@PathVariable String taskId) {
        SseEmitter emitter = sseService.getOrRegisterEmitter(taskId);
        return emitter;
    }
}
