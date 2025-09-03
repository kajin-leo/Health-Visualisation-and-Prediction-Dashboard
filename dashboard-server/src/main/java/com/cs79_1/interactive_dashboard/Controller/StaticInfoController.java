package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.WeightStatus;
import com.cs79_1.interactive_dashboard.DTO.SleepSummary;
import com.cs79_1.interactive_dashboard.Security.SecurityUtils;
import com.cs79_1.interactive_dashboard.Service.StaticInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/static")
public class StaticInfoController {
    @Autowired
    private StaticInfoService staticInfoService;

    @GetMapping("/weight-metrics")
    public ResponseEntity<?> getWeightMetricsZScore() {
        long userId = SecurityUtils.getCurrentUserId();

        try {
            double[] l = staticInfoService.getFourDimensionalL(userId);
            double[] m = staticInfoService.getFourDimensionalM(userId);
            double[] s = staticInfoService.getFourDimensionalS(userId);
            double[] z = staticInfoService.getFourDimensionalZScores(userId);
            double[] percentile = staticInfoService.getFourDimensionalPercentile(userId);
            String[] classification = staticInfoService.getFourDimensionalClassification(userId);
            WeightStatus weightStatus = new WeightStatus();

            weightStatus.setIotfL(l[0]);
            weightStatus.setIotfM(m[0]);
            weightStatus.setIotfS(s[0]);
            weightStatus.setIotfZ(z[0]);
            weightStatus.setIotfP(percentile[0]);
            weightStatus.setIotfC(classification[0]);

            weightStatus.setCacheraL(l[1]);
            weightStatus.setCacheraM(m[1]);
            weightStatus.setCacheraS(s[1]);
            weightStatus.setCacheraZ(z[1]);
            weightStatus.setCacheraP(percentile[1]);
            weightStatus.setCacheraC(classification[1]);

            weightStatus.setOmsL(l[2]);
            weightStatus.setOmsM(m[2]);
            weightStatus.setOmsS(s[2]);
            weightStatus.setOmsZ(z[2]);
            weightStatus.setOmsP(percentile[2]);
            weightStatus.setOmsC(classification[2]);

            weightStatus.setCdcL(l[3]);
            weightStatus.setCdcM(m[3]);
            weightStatus.setCdcS(s[3]);
            weightStatus.setCdcZ(z[3]);
            weightStatus.setCdcP(percentile[3]);
            weightStatus.setCdcC(classification[3]);

            return ResponseEntity.ok(weightStatus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No such user id");
        }
    }
    @GetMapping("/sleep-summary")
    public ResponseEntity<SleepSummary> getSleepSummary() {
        long userId = SecurityUtils.getCurrentUserId();

        double school = staticInfoService.getSchoolNightAvgHours(userId);
        double weekend = staticInfoService.getWeekendNightAvgHours(userId);
        double week = staticInfoService.getTotalWeekHours(userId);

        int thisWeekAvgMin = (int) Math.round((week / 7.0) * 60.0);

        SleepSummary dto = new SleepSummary();
        dto.setThisWeekAvgMin(thisWeekAvgMin);
        dto.setSchoolNightAvgHrs(school);
        dto.setWeekendNightAvgHrs(weekend);

        return ResponseEntity.ok(dto);
    }
}
