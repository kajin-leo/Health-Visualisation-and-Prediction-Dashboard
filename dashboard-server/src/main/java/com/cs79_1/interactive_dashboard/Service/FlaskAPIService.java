package com.cs79_1.interactive_dashboard.Service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FlaskAPIService {
    private static final Logger logger = LoggerFactory.getLogger(FlaskAPIService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ML_PORT:5000}")
    private String mlPort;

    private String API_URL;
    
    @PostConstruct
    public void init() {
        this.API_URL = String.format("http://ml-service:%s/api/predict", mlPort);
        logger.info("API_URL initialized to: {}", API_URL);
    }

    public Object getHeatmap(long userId) {
        logger.info("URL:{}", API_URL);

        String url = API_URL + "?sid=" + userId;
        return restTemplate.getForObject(url, Object.class);
    }
}
