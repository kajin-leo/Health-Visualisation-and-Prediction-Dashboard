package com.cs79_1.interactive_dashboard.Service;

import com.cs79_1.interactive_dashboard.DTO.BodyMetricsSummaryDTO;
import com.cs79_1.interactive_dashboard.Entity.BodyMetrics;
import com.cs79_1.interactive_dashboard.Entity.User;
import com.cs79_1.interactive_dashboard.Entity.BodyComposition;
import com.cs79_1.interactive_dashboard.Enum.HFZClassification;
import com.cs79_1.interactive_dashboard.Repository.BodyMetricsRepository;
import com.cs79_1.interactive_dashboard.Repository.BodyCompositionRepository;
import com.cs79_1.interactive_dashboard.Repository.WeeklyIntakeRepository;
import com.cs79_1.interactive_dashboard.Repository.MentalHealthAndDailyRoutineRepository;
import com.cs79_1.interactive_dashboard.Repository.WeightMetricsRepository;
import com.cs79_1.interactive_dashboard.DTO.BodyCompositionSummary;
import com.cs79_1.interactive_dashboard.DTO.DietaryIntake.FoodIntakeResultDto;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class StaticInfoService {
    @Autowired
    private BodyMetricsRepository bodyMetricsRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private WeightMetricsRepository weightMetricsRepository;

    @Autowired
    private MentalHealthAndDailyRoutineRepository mentalHealthAndDailyRoutineRepository;

    @Autowired
    private BodyCompositionRepository bodyCompositionRepository;


    private final static Logger logger = LoggerFactory.getLogger(StaticInfoService.class);

    public double[] getFourDimensionalZScores(long userId){
        try {
            Optional<User> userOptional = userService.getUserByUserId(userId);
            if(userOptional.isPresent()){
                User user = userOptional.get();

                double IOTFZScore = weightMetricsRepository.getIotfZByUserId(user);
                double CacheraZScore = weightMetricsRepository.getCacheraZByUserId(user);
                double OMSZScore = weightMetricsRepository.getOmsZByUserId(user);
                double CDCZScore = weightMetricsRepository.getCdcZByUserId(user);

                return new double[]{IOTFZScore, CacheraZScore, OMSZScore, CDCZScore};
            }

            throw new RuntimeException("User not exist");
        } catch (Exception e) {
            logger.error("Error in getFourDimensionalZScores by UserId {}", userId, e);
            throw new RuntimeException(e.getMessage());
        }
    }

    public double[] getFourDimensionalL(long userId){
        try {
            Optional<User> userOptional = userService.getUserByUserId(userId);
            if(userOptional.isPresent()){
                User user = userOptional.get();

                double IOTFL = weightMetricsRepository.getIotfLByUserId(user);
                double CacheraL = weightMetricsRepository.getCacheraLByUserId(user);
                double OMSL = weightMetricsRepository.getOmsLByUserId(user);
                double CDCL = weightMetricsRepository.getCdcLByUserId(user);

                return new double[]{IOTFL, CacheraL, OMSL, CDCL};
            }

            throw new RuntimeException("User not exist");
        } catch (Exception e) {
            logger.error("Error in getFourDimensionalL by UserId {}", userId, e);
            throw new RuntimeException(e.getMessage());
        }
    }

    public double[] getFourDimensionalM(long userId){
        try {
            Optional<User> userOptional = userService.getUserByUserId(userId);
            if(userOptional.isPresent()){
                User user = userOptional.get();

                double IOTFM = weightMetricsRepository.getIotfMByUserId(user);
                double CacheraM = weightMetricsRepository.getCacheraMByUserId(user);
                double OMSM = weightMetricsRepository.getOmsMByUserId(user);
                double CDCM = weightMetricsRepository.getCdcMByUserId(user);

                return new double[]{IOTFM, CacheraM, OMSM, CDCM};
            }

            throw new RuntimeException("User not exist");
        } catch (Exception e) {
            logger.error("Error in getFourDimensionalM by UserId {}", userId, e);
            throw new RuntimeException(e.getMessage());
        }
    }

    public double[] getFourDimensionalS(long userId){
        try {
            Optional<User> userOptional = userService.getUserByUserId(userId);
            if(userOptional.isPresent()){
                User user = userOptional.get();

                double IOTFS = weightMetricsRepository.getIotfSByUserId(user);
                double CacheraS = weightMetricsRepository.getCacheraSByUserId(user);
                double OMSS = weightMetricsRepository.getOmsSByUserId(user);
                double CDCS = weightMetricsRepository.getCdcSByUserId(user);

                return new double[]{IOTFS, CacheraS, OMSS, CDCS};
            }

            throw new RuntimeException("User not exist");
        } catch (Exception e) {
            logger.error("Error in getFourDimensionalS by UserId {}", userId, e);
            throw new RuntimeException(e.getMessage());
        }
    }

    public double[] getFourDimensionalPercentile(long userId){
        try {
            Optional<User> userOptional = userService.getUserByUserId(userId);
            if(userOptional.isPresent()){
                User user = userOptional.get();

                double IOTFPercentile = weightMetricsRepository.getIotfPercentileByUserId(user);
                double CacheraPercentile = weightMetricsRepository.getCacheraPercentileByUserId(user);
                double OMSPercentile = weightMetricsRepository.getOmsPercentileByUserId(user);
                double CDCPercentile = weightMetricsRepository.getCdcPercentileByUserId(user);

                return new double[]{IOTFPercentile, CacheraPercentile, OMSPercentile, CDCPercentile};
            }

            throw new RuntimeException("User not exist");
        } catch (Exception e) {
            logger.error("Error in getFourDimensionalPercentile by UserId {}", userId, e);
            throw new RuntimeException(e.getMessage());
        }
    }

    public String[] getFourDimensionalClassification(long userId){
        try {
            Optional<User> userOptional = userService.getUserByUserId(userId);
            if(userOptional.isPresent()){
                User user = userOptional.get();

                String IOTFClassification = weightMetricsRepository.getIotfClassificationByUserId(user).name();
                String CacheraClassification = weightMetricsRepository.getCacheraClassificationByUserId(user).name();
                String OMSClassification = weightMetricsRepository.getOmsClassificationByUserId(user).name();
                String CDCClassification = weightMetricsRepository.getCdcClassificationByUserId(user).name();

                return new String[]{IOTFClassification, CacheraClassification, OMSClassification, CDCClassification};
            }

            throw new RuntimeException("User not exist");
        } catch (Exception e) {
            logger.error("Error in getFourDimensionalClassification by UserId {}", userId, e);
            throw new RuntimeException(e.getMessage());
        }
    }
    
    private com.cs79_1.interactive_dashboard.Entity.MentalHealthAndDailyRoutine loadSleepRow(long userId) {
        return mentalHealthAndDailyRoutineRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("No sleep row for user " + userId));
    }

    public double getSchoolNightAvgHours(long userId) {
        return loadSleepRow(userId).getWeekdaySleepingAvgDuration();
    }

    public double getWeekendNightAvgHours(long userId) {
        return loadSleepRow(userId).getWeekendSleepingAvgDuration();
    }

    public double getTotalWeekHours(long userId) {
        return loadSleepRow(userId).getTotalSleepingDuration();
    }
    public BodyCompositionSummary getBodyCompositionSummary(long userId) {
        BodyComposition bc = bodyCompositionRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No body composition for user " + userId));

        double fat = bc.getFatPercentage();
        double muscle = bc.getMuscleAmount();
        double water = bc.getWaterPercentage();
        double wlgr625 = bc.getWlgr625();
        double wlgr50 = bc.getWlgr50();
        double wlgx625 = bc.getWlgx625();
        double wlgx50 = bc.getWlgx50();
        double bmi = bc.getBmi();
        
        double sum = fat + muscle + water;
        if (sum > 100.0 && sum > 0) {
            fat    = fat / sum * 100.0;
            muscle = muscle / sum * 100.0;
            water  = water  / sum * 100.0;
        }

        BodyCompositionSummary dto = new BodyCompositionSummary();
        dto.setFatPct(fat);
        dto.setMusclePct(muscle);
        dto.setWaterPct(water);
        dto.setWlgr625(wlgr625);
        dto.setWlgr50(wlgr50);
        dto.setWlgx625(wlgx625);
        dto.setWlgx50(wlgx50);
        dto.setBmi(bmi);

        return dto;
    }

    public BodyMetricsSummaryDTO getBodyMetricsSummary(long userId) {
        BodyMetrics bodyMetrics = bodyMetricsRepository.findByUserId(userId);
        BodyComposition bodyComposition = bodyCompositionRepository.findByUserId(userId).orElseThrow();

        double height = bodyMetrics.getHeight();
        double weight = bodyMetrics.getWeight();
        double waistSize = bodyMetrics.getWaistSize();
        double bmi = bodyComposition.getBMI();
        HFZClassification classification = bodyComposition.getHfzBMI();

        BodyMetricsSummaryDTO dto = new BodyMetricsSummaryDTO(height, weight, waistSize, bmi, classification);
        return dto;
    }

    @Service
    public class FoodIntakeService {

        @Autowired
        private WeeklyIntakeRepository weeklyIntakeRepository;
        private static final double REC_ENERGY_PCT = 50.0;
        private static final double REC_PROTECTIVE_PCT = 35.0;
        private static final double REC_BODY_PCT = 15.0;

        public double getFoodIntakeEnergy(long userId) {
            return weeklyIntakeRepository.findEnergyByUserId(userId).orElse(0.0);
        }

        public double getFoodIntakeProtective(long userId) {
            return weeklyIntakeRepository.findProtectiveByUserId(userId).orElse(0.0);
        }

        public double getFoodIntakeBodyBuilding(long userId) {
            return weeklyIntakeRepository.findBodyBuildingByUserId(userId).orElse(0.0);
        }

        public FoodIntakeResultDto calculateFoodIntake(long userId) {
            double energy = getFoodIntakeEnergy(userId);
            double protective = getFoodIntakeProtective(userId);
            double bodyBuilding = getFoodIntakeBodyBuilding(userId);

            double total = energy + protective + bodyBuilding;

            double recEnergy = (REC_ENERGY_PCT / 100.0) * total;
            double recProtective = (REC_PROTECTIVE_PCT / 100.0) * total;
            double recBody = (REC_BODY_PCT / 100.0) * total;

            // % of recommendation achieved (actual / recommended * 100)
            double pctEnergy = recEnergy > 0 ? (energy / recEnergy) * 100.0 : 0.0;
            double pctProtective = recProtective > 0 ? (protective / recProtective) * 100.0 : 0.0;
            double pctBody = recBody > 0 ? (bodyBuilding / recBody) * 100.0 : 0.0;

            double dailyPctEnergy = total > 0 ? (energy / total) * 100.0 : 0.0;
            double dailyPctProtective = total > 0 ? (protective / total) * 100.0 : 0.0;
            double dailyPctBody = total > 0 ? (bodyBuilding / total) * 100.0 : 0.0;

            FoodIntakeResultDto dto = new FoodIntakeResultDto();
            dto.setEnergy(energy);
            dto.setProtective(protective);
            dto.setBodyBuilding(bodyBuilding);

            dto.setRecEnergy(recEnergy);
            dto.setRecProtective(recProtective);
            dto.setRecBodyBuilding(recBody);

            dto.setPctEnergy(pctEnergy);
            dto.setPctProtective(pctProtective);
            dto.setPctBodyBuilding(pctBody);

            dto.setDailyPctEnergy(dailyPctEnergy);
            dto.setDailyPctProtective(dailyPctProtective);
            dto.setDailyPctBodyBuilding(dailyPctBody);

            return dto;
        }

    }
}
