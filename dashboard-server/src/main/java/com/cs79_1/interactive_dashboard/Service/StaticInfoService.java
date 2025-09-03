package com.cs79_1.interactive_dashboard.Service;

import com.cs79_1.interactive_dashboard.Entity.User;
import com.cs79_1.interactive_dashboard.Entity.BodyComposition;
import com.cs79_1.interactive_dashboard.Repository.BodyMetricsRepository;
import com.cs79_1.interactive_dashboard.Repository.BodyCompositionRepository;
import com.cs79_1.interactive_dashboard.Repository.MentalHealthAndDailyRoutineRepository;
import com.cs79_1.interactive_dashboard.Repository.WeightMetricsRepository;
import com.cs79_1.interactive_dashboard.DTO.BodyCompositionSummary;

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
        BodyComposition bc = bodyCompositionRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("No body composition for user " + userId));

        double fat = bc.getFatPercentage();
        double muscle = bc.getMuscleAmount();
        double water = bc.getWaterPercentage();

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

        return dto;
    }

}
