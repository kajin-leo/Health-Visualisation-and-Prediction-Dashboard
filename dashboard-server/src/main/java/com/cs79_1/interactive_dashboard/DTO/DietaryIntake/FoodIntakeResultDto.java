package com.cs79_1.interactive_dashboard.DTO.DietaryIntake;

public class FoodIntakeResultDto {
    private double energy;
    private double protective;
    private double bodyBuilding;

    // Recommended absolute amounts (derived from % of daily total)
    private double recEnergy;
    private double recProtective;
    private double recBodyBuilding;

    // Actual vs recommendation (%)
    private double pctEnergy;
    private double pctProtective;
    private double pctBodyBuilding;

    //share of daily (% actual / total).
    private double dailyPctEnergy;
    private double dailyPctProtective;
    private double dailyPctBodyBuilding;

    public double getEnergy() { return energy; }
    public void setEnergy(double energy) { this.energy = energy; }

    public double getProtective() { return protective; }
    public void setProtective(double protective) { this.protective = protective; }

    public double getBodyBuilding() { return bodyBuilding; }
    public void setBodyBuilding(double bodyBuilding) { this.bodyBuilding = bodyBuilding; }

    public double getRecEnergy() { return recEnergy; }
    public void setRecEnergy(double recEnergy) { this.recEnergy = recEnergy; }

    public double getRecProtective() { return recProtective; }
    public void setRecProtective(double recProtective) { this.recProtective = recProtective; }

    public double getRecBodyBuilding() { return recBodyBuilding; }
    public void setRecBodyBuilding(double recBodyBuilding) { this.recBodyBuilding = recBodyBuilding; }

    public double getPctEnergy() { return pctEnergy; }
    public void setPctEnergy(double pctEnergy) { this.pctEnergy = pctEnergy; }

    public double getPctProtective() { return pctProtective; }
    public void setPctProtective(double pctProtective) { this.pctProtective = pctProtective; }

    public double getPctBodyBuilding() { return pctBodyBuilding; }
    public void setPctBodyBuilding(double pctBodyBuilding) { this.pctBodyBuilding = pctBodyBuilding; }

    public double getDailyPctEnergy() { return dailyPctEnergy; }
    public void setDailyPctEnergy(double dailyPctEnergy) { this.dailyPctEnergy = dailyPctEnergy; }

    public double getDailyPctProtective() { return dailyPctProtective; }
    public void setDailyPctProtective(double dailyPctProtective) { this.dailyPctProtective = dailyPctProtective; }

    public double getDailyPctBodyBuilding() { return dailyPctBodyBuilding; }
    public void setDailyPctBodyBuilding(double dailyPctBodyBuilding) { this.dailyPctBodyBuilding = dailyPctBodyBuilding; }
}
