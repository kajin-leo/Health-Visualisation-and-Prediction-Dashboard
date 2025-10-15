package com.cs79_1.interactive_dashboard.Service;

import com.cs79_1.interactive_dashboard.Component.RabbitMQConfig;
import com.cs79_1.interactive_dashboard.DTO.Simulation.AlteredActivityPredictionRequest;
import com.cs79_1.interactive_dashboard.DTO.Simulation.HeatmapTaskResponse;
import com.cs79_1.interactive_dashboard.DTO.Simulation.PredictionResultDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

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
        String taskId = getHeatmapTaskId(userId);
        if (taskId == null) {
            taskId = UUID.randomUUID().toString();
            String redisKey = getHeatmapTaskRedisKey(userId);
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
        redisService.saveWithExpire(redisKey, taskId, 2, TimeUnit.MINUTES);
        sendPredictionTask(request, taskId);

        return taskId;
    }

    void sendHeatmapTask(long userId) {
        logger.info("Sending heatmap task to RabbitMQ for {}", userId);
        rabbitTemplate.convertAndSend(RabbitMQConfig.HEATMAP_TASK_QUEUE, userId);
    }

    void sendPredictionTask(AlteredActivityPredictionRequest request, String taskId) {
        logger.info("Sending prediction task to RabbitMQ as {}", taskId);
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
            logger.error("Exception occurred while sending result for prediction taskId: " + taskId, e);
            sseService.sendError(taskId, e.getMessage());
        }
    }

    public String getHeatmapTaskId(long userId) {
        String redisTaskKey = "heatmap_task::" + userId;
        String taskId = redisService.getObject(redisTaskKey, String.class);
        return taskId;
    }

    public String getHeatmapTaskRedisKey(long userId) {
        String redisKey = "heatmap_task::" + userId;
        return redisKey;
    }

    @RabbitListener(queues = RabbitMQConfig.HEATMAP_RESULT_QUEUE)
    public void handleHeatmapResult(HeatmapTaskResponse result) {
        long userId = result.getUserId();
        String taskId = getHeatmapTaskId(userId);
        try {
            logger.info("Received Heatmap result for taskId: " + taskId);
            String redisTaskKey = getHeatmapTaskRedisKey(userId);
            String redisKey = "heatmap::" + userId;
            redisService.saveWithExpire(redisKey, result, 30, TimeUnit.MINUTES);

            logger.info("Sending heatmap result for taskId: " + taskId);
            redisService.delete(redisTaskKey);
            sseService.sendResult(taskId, result);
        } catch (Exception e) {
            logger.error("Exception occurred while sending result for heatmap taskId: " + taskId, e);
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
