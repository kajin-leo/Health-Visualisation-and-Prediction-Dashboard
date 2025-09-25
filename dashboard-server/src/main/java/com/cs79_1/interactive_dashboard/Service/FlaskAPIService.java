package com.cs79_1.interactive_dashboard.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FlaskAPIService {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${ML_PORT:5485}")
    private String mlPort;

    private static final String API_URL = "localhost";
}
