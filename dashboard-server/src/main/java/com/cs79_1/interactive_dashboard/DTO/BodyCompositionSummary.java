package com.cs79_1.interactive_dashboard.DTO;

public class BodyCompositionSummary {
    private double fatPct;
    private double musclePct;
    private double waterPct;

    public double getFatPct() { return fatPct; }
    public void setFatPct(double fatPct) { this.fatPct = fatPct; }
    public double getMusclePct() { return musclePct; }
    public void setMusclePct(double musclePct) { this.musclePct = musclePct; }
    public double getWaterPct() { return waterPct; }
    public void setWaterPct(double waterPct) { this.waterPct = waterPct; }
    
    private double wlgr625;
    private double wlgr50;
    private double wlgx625;
    private double wlgx50;
    private double BMI;
    public double getWlgr625() { return wlgr625; }
    public void setWlgr625(double wlgr625) { this.wlgr625 = wlgr625; }
    public double getWlgr50() { return wlgr50; }
    public void setWlgr50(double wlgr50) { this.wlgr50 = wlgr50; }
    public double getWlgx625() { return wlgx625; }
    public void setWlgx625(double wlgx625) { this.wlgx625 = wlgx625; }
    public double getWlgx50() { return wlgx50; }
    public void setWlgx50(double wlgx50) { this.wlgx50 = wlgx50; }
    public double getBmi() {return BMI;}
    public void setBmi(double bmi) { this.BMI = bmi; }
}
