package com.cs79_1.interactive_dashboard.DTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ImportProgress {
    private String jobId;
    private int totalNum;
    private int processedNum;
    private int failedNum;
    private boolean completed = false;
    private boolean success = false;
    private LocalDateTime startTime = LocalDateTime.now();
    private LocalDateTime completedTime;
    private List<String> errors = new ArrayList<>();
    private int current;
    private String status = "Starting...";

    public ImportProgress(String jobId, int total){
        this.jobId = jobId;
        this.totalNum = total;
    }

    public synchronized void incrementProgress(){
        this.processedNum++;
    }

    public synchronized void incrementFailed(){
        this.failedNum++;
    }

    public synchronized void addError(String error){
        if (errors.size() < 100) {
            errors.add(error);
        }
    }

    public int getPercentage() {
        if (totalNum == 0) return 0;
        return (processedNum + failedNum) * 100 / totalNum;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
        if (completed) {
            this.completedTime = LocalDateTime.now();
        }
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public int getTotalNum() {
        return totalNum;
    }

    public void setTotalNum(int totalNum) {
        this.totalNum = totalNum;
    }

    public int getProcessedNum() {
        return processedNum;
    }

    public void setProcessedNum(int processedNum) {
        this.processedNum = processedNum;
    }

    public int getFailedNum() {
        return failedNum;
    }

    public void setFailedNum(int failedNum) {
        this.failedNum = failedNum;
    }

    public boolean isCompleted() {
        return completed;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getCompletedTime() {
        return completedTime;
    }

    public void setCompletedTime(LocalDateTime completedTime) {
        this.completedTime = completedTime;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public int getCurrent() {
        return current;
    }

    public void setCurrent(int current) {
        this.current = current;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}