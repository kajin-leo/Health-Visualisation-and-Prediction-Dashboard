package com.cs79_1.interactive_dashboard.Component;

import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Queue;


@Component
public class RabbitMQConfig {
    public static final String PREDICT_TASK_QUEUE = "predict.task.queue";
    public static final String HEATMAP_TASK_QUEUE = "heatmap.task.queue";
    public static final String PREDICT_RESULT_QUEUE = "predict.result.queue";
    public static final String HEATMAP_RESULT_QUEUE = "heatmap.result.queue";

    @Bean
    public Queue predictTaskQueue() {
        return new Queue(PREDICT_TASK_QUEUE, true);
    }

    @Bean
    public Queue heatmapTaskQueue() {
        return new Queue(HEATMAP_TASK_QUEUE, true);
    }

    @Bean
    public Queue predictResultQueue() {
        return new Queue(PREDICT_RESULT_QUEUE, true);
    }

    @Bean
    public Queue heatmapResultQueue() {
        return new Queue(HEATMAP_RESULT_QUEUE, true);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
