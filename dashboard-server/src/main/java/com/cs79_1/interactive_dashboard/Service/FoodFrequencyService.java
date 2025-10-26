package com.cs79_1.interactive_dashboard.Service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.cs79_1.interactive_dashboard.DTO.FoodFrequencyRequest;
import com.cs79_1.interactive_dashboard.Entity.FoodFrequencyRecord;
import com.cs79_1.interactive_dashboard.Repository.FoodFrequencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FoodFrequencyService {

    @Autowired
    private FoodFrequencyRepository foodFrequencyRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public void saveFoodFrequency(FoodFrequencyRequest request) throws JsonProcessingException {
        String foodFreqJson = objectMapper.writeValueAsString(request.getFoodFrequency());
        String servingsJson = objectMapper.writeValueAsString(request.getServings());

        FoodFrequencyRecord record = new FoodFrequencyRecord(
                request.getUserId(),
                foodFreqJson,
                servingsJson
        );

        foodFrequencyRepository.save(record);
    }
}
