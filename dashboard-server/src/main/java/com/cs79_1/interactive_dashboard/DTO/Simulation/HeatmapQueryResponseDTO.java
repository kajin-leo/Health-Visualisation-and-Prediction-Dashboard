package com.cs79_1.interactive_dashboard.DTO.Simulation;

public class HeatmapQueryResponseDTO {
    Object data;
    boolean fromCache = false;
    String taskId;

    public HeatmapQueryResponseDTO(Object data, boolean fromCache, String taskId) {
        this.data = data;
        this.fromCache = fromCache;
        this.taskId = taskId;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public boolean isFromCache() {
        return fromCache;
    }

    public void setFromCache(boolean fromCache) {
        this.fromCache = fromCache;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }
}
