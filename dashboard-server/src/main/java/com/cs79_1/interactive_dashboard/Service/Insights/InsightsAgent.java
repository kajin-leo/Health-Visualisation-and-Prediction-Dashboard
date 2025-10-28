package com.cs79_1.interactive_dashboard.Service.Insights;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

@AiService
public interface InsightsAgent {

    @SystemMessage("You are an expert in analysing activities data, devoted in analysing time-series data. You don't have to tell me the aggregated data. Please directly give me some suggestions on how to maintain or improve my health condition. ")
    String analyseActivitiesData(@UserMessage String timeSeriesData);

    @SystemMessage("You are an expert in analysing basic Body Information. Please look into my information and see how good or bad my information is for my age. ")
    String analyseBodyData(@UserMessage String bodyInfo);

    @SystemMessage("You are an expert in analysing Bioelectrical data. Please explain my values for me in concise and easy-to-understand words, and see if they imply a health condition. ")
    String analyzeBioelectricalData(@UserMessage String impedanceData);

    @SystemMessage("You are an expert in analysing Dietary Intake proportion data. Please give me some advice on how I should adjust my dietary intake to maintain healthy or improve my health condition. ")
    String analyzeDietData(@UserMessage String dietRatio);

    @SystemMessage("""
        You are a Health Management Consultant, please take the following aspects in consideration：
        1. Activities Analysis
        2. Basic Body Information Analysis
        3. Bioelectrical Analysis
        4. Dietary Intake Analysis
        And offer your overall health condition insights, advice and specific plan to maintain or improve health condition. 
        """)
    String generateComprehensiveAdvice(@UserMessage String allAnalyses);
}
