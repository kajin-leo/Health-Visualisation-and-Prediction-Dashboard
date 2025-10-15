package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.DietaryIntake.FoodIntakeByCategory;
import com.cs79_1.interactive_dashboard.DTO.DietaryIntake.FoodIntakeResultDto;
import com.cs79_1.interactive_dashboard.Entity.WeeklyIntake;
import com.cs79_1.interactive_dashboard.Repository.UserRepository;
import com.cs79_1.interactive_dashboard.Repository.WeeklyIntakeRepository;
import com.cs79_1.interactive_dashboard.Security.SecurityUtils;
import com.cs79_1.interactive_dashboard.Service.StaticInfoService.FoodIntakeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.cs79_1.interactive_dashboard.Service.DietRecommendationService;
import com.cs79_1.interactive_dashboard.Entity.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food-intake")
public class FoodIntakeController {
    @Autowired
    private DietRecommendationService dietRecommendationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodIntakeService foodIntakeService;

    @Autowired
    private WeeklyIntakeRepository weeklyIntakeRepository;

    @GetMapping("/rings")
    public FoodIntakeResultDto getFoodIntakeRings() {
        long userId = SecurityUtils.getCurrentUserId();
        return foodIntakeService.calculateFoodIntake(userId);
    }

    @GetMapping("/intake-by-category")

    public List<FoodIntakeByCategory> getWeeklyIntakeByUser(@RequestParam(defaultValue = "balanced") String goal) {

        long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        int age = user.getAgeYear();
        int sex = user.getSex();

        Map<String, Double> recommendations = dietRecommendationService.getRecommendations(age, sex, goal);

        WeeklyIntake intake = weeklyIntakeRepository.findByUserId(userId);
        List<FoodIntakeByCategory> result = new ArrayList<>();
        result.add(new FoodIntakeByCategory("Grains", intake.getCereals(), recommendations.get("Grains")));
        result.add(new FoodIntakeByCategory("Vegetables", intake.getVegetablesAndLegumes(), recommendations.get("Vegetables")));
        result.add(new FoodIntakeByCategory("Fruit", intake.getFruit(), recommendations.get("Fruit")));
        result.add(new FoodIntakeByCategory("Dairy", intake.getDairy(), recommendations.get("Dairy")));
        result.add(new FoodIntakeByCategory("Meat", intake.getMeatFishPoultryEggs(), recommendations.get("Meat")));

        return result;
    }
}
