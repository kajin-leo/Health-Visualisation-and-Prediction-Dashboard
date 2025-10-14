package com.cs79_1.interactive_dashboard.Service;

import com.cs79_1.interactive_dashboard.Component.RabbitMQConfig;
import com.cs79_1.interactive_dashboard.DTO.Simulation.AlteredActivityPredictionRequest;
import com.cs79_1.interactive_dashboard.DTO.Simulation.PredictionResultDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SimulationService {
    @Autowired
    RabbitTemplate rabbitTemplate;

    @Autowired
    RedisService redisService;

    @Autowired
    private SseService sseService;

    private final static Logger logger = LoggerFactory.getLogger(SimulationService.class);

    public String getOrCreateHeatmapTask(long userId) {
        String redisKey = "heatmap_task::" + userId;
        String taskId = redisService.getObject(redisKey, String.class);
        if (taskId == null) {
            taskId = UUID.randomUUID().toString();
            redisService.saveObject(redisKey, taskId);
            sendHeatmapTask(userId);
        }

        return taskId;
    }

    public Object getHeatmap(long userId) {
        String redisKey = "heatmap::" + userId;
        Object heatmap = redisService.getObject(redisKey, Object.class);

        return heatmap;
    }

    public String createPredictionTask(long userId, AlteredActivityPredictionRequest request) {
        String redisKey = "prediction_result::" + userId;
        String taskId = redisService.getObject(redisKey, String.class);
        if (taskId != null) {
            redisService.delete(redisKey);
        }
        taskId = UUID.randomUUID().toString();
        redisService.saveObject(redisKey, taskId);
        sendPredictionTask(request, taskId);

        return taskId;
    }

    void sendHeatmapTask(long userId) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.HEATMAP_TASK_QUEUE, userId);
    }

    void sendPredictionTask(AlteredActivityPredictionRequest request, String taskId) {
        PredictionTask task = new PredictionTask(request, taskId);
        rabbitTemplate.convertAndSend(RabbitMQConfig.PREDICT_TASK_QUEUE, task);
    }

    @RabbitListener(queues = RabbitMQConfig.PREDICT_RESULT_QUEUE)
    public void handlePredictionResult(PredictionResultDTO result) {
        String taskId = result.getTaskId();
        logger.info("Received Prediction result for taskId: " + taskId);

        try {
            logger.info("Sending prediction result for taskId: " + taskId);
            sseService.sendResult(taskId, result);
        } catch (Exception e) {
            logger.error("Exception occurred while sending result for taskId: " + taskId, e);
            sseService.sendError(taskId, e.getMessage());
        }
    }

    public class PredictionTask {
        AlteredActivityPredictionRequest request;
        String taskId;

        public PredictionTask(AlteredActivityPredictionRequest request, String taskId) {
            this.request = request;
            this.taskId = taskId;
        }

        public AlteredActivityPredictionRequest getRequest() {
            return request;
        }

        public String getTaskId() {
            return taskId;
        }
    }
}
