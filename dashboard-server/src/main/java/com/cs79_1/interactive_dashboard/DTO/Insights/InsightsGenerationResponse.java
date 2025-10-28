package com.cs79_1.interactive_dashboard.DTO.Insights;

import lombok.Data;

@Data
public class InsightsGenerationResponse {
    boolean isCached;
    String taskId;
    ComprehensiveInsightsDTO insights;
}
