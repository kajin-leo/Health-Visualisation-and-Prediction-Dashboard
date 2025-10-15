package com.cs79_1.interactive_dashboard.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.Map;

@Service
public class SseService {
    private static final Logger logger = LoggerFactory.getLogger(SseService.class);
    private final Map<String, SseEmitter> sseEmitters = new HashMap<>();

    public SseEmitter getOrRegisterEmitter(String taskId) {
        SseEmitter emitter = sseEmitters.get(taskId);
        if (emitter == null) {
            emitter = new SseEmitter(300000L);

            emitter.onCompletion(() -> {
                removeEmitter(taskId);
            });

            emitter.onTimeout(() -> {
                removeEmitter(taskId);
            });

            emitter.onTimeout(() -> {
                removeEmitter(taskId);
            });

            sseEmitters.put(taskId, emitter);
        }

        return emitter;
    }

    public void removeEmitter(String taskId) {
        if (sseEmitters.containsKey(taskId)) {
            sseEmitters.remove(taskId);
        }
    }

    public void sendResult(String taskId, Object result) {
        SseEmitter emitter = getOrRegisterEmitter(taskId);
        try {
            emitter.send(SseEmitter.event().name("result").data(result));
            emitter.complete();
            logger.info("Sent result for taskId: " + taskId);
        } catch (Exception e) {
            emitter.completeWithError(e);
            logger.error("Failed to send result for taskId: " + taskId, e);
        } finally {
            removeEmitter(taskId);
        }
    }

    public void sendError(String taskId, String errorMessage) {
        SseEmitter emitter = getOrRegisterEmitter(taskId);

        try {
            emitter.send(SseEmitter.event().name("error").data(errorMessage));
            emitter.completeWithError(new RuntimeException(errorMessage));
        }  catch (Exception e) {
            emitter.completeWithError(e);
        } finally {
            removeEmitter(taskId);
        }
    }
}
