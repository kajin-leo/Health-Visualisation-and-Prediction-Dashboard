package com.cs79_1.interactive_dashboard.DTO.DietaryIntake;

public class FoodIntakeSummary {
    private double energy;
    private double protective;
    private double bodyBuilding;
    private double limitedFood;
    private double limitedBeverages;

    public double getEnergy() { return energy; }
    public void setEnergy(double energy) { this.energy = energy; }
    public double getProtective() { return protective; }
    public void setProtective(double protective) { this.protective = protective; }
    public double getBodyBuilding() { return bodyBuilding; }
    public void setBodyBuilding(double bodyBuilding) { this.bodyBuilding = bodyBuilding; }
    public double getLimitedFood() { return limitedFood; }
    public void setLimitedFood(double limitedFood) { this.limitedFood = limitedFood; }
    public double getLimitedBeverages() { return limitedBeverages; }
    public void setLimitedBeverages(double limitedBeverages) { this.limitedBeverages = limitedBeverages; }
}
