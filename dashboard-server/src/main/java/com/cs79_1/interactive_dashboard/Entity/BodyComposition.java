package com.cs79_1.interactive_dashboard.Entity;

import com.cs79_1.interactive_dashboard.Enum.HFZClassification;
import jakarta.persistence.*;

@Entity
public class BodyComposition {
    @Id
    @GeneratedValue
    private long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false)
    private double fatPercentage;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private HFZClassification hfzFatPercentage;

    @Column(nullable = false)
    private double fatMass;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private HFZClassification hfzFatMass;

    @Column(nullable = false)
    private double BMI;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private HFZClassification hfzBMI;

    @Column(nullable = false)
    private double fatAmount;

    @Column(nullable = false)
    private double ffmAmount; //Fat-free Mass

    @Column(nullable = false)
    private double muscleAmount;

    @Column(nullable = false)
    private double waterAmount;

    @Column(nullable = false)
    private double waterPercentage;

    @Column(nullable = false)
    private double wlgr625; // Whole-body bioelectrical impedance - resistance 6.25khz

    @Column(nullable = false)
    private double wlgx625; // Whole-body bioelectrical impedance - reactance 6.25khz

    @Column(nullable = false)
    private double wlgr50; // 50khz

    @Column(nullable = false)
    private double wlgx50; // 50khz

    public BodyComposition() {}

    public BodyComposition(User user) {
        this.user = user;
    }

    public long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getFatPercentage() {
        return fatPercentage;
    }

    public void setFatPercentage(double fatPercentage) {
        this.fatPercentage = fatPercentage;
    }

    public HFZClassification getHfzFatPercentage() {
        return hfzFatPercentage;
    }

    public void setFatMass(double fatMass) {
        this.fatMass = fatMass;
    }

    public double getFatMass() {
        return fatMass;
    }

    public void setHfzFatPercentage(HFZClassification hfzFatPercentage) {
        this.hfzFatPercentage = hfzFatPercentage;
    }

    public HFZClassification getHfzFatMass() {
        return hfzFatMass;
    }

    public void setHfzFatMass(HFZClassification hfzFatMass) {
        this.hfzFatMass = hfzFatMass;
    }

    public double getBMI() {
        return BMI;
    }

    public void setBMI(double BMI) {
        this.BMI = BMI;
    }

    public HFZClassification getHfzBMI() {
        return hfzBMI;
    }

    public void setHfzBMI(HFZClassification hfzBMI) {
        this.hfzBMI = hfzBMI;
    }

    public double getFatAmount() {
        return fatAmount;
    }

    public void setFatAmount(double fatAmount) {
        this.fatAmount = fatAmount;
    }

    public double getFfmAmount() {
        return ffmAmount;
    }

    public void setFfmAmount(double ffmAmount) {
        this.ffmAmount = ffmAmount;
    }

    public double getMuscleAmount() {
        return muscleAmount;
    }

    public void setMuscleAmount(double muscleAmount) {
        this.muscleAmount = muscleAmount;
    }

    public double getWaterAmount() {
        return waterAmount;
    }

    public void setWaterAmount(double waterAmount) {
        this.waterAmount = waterAmount;
    }

    public double getWaterPercentage() {
        return waterPercentage;
    }

    public void setWaterPercentage(double waterPercentage) {
        this.waterPercentage = waterPercentage;
    }

    public double getWlgr625() {
        return wlgr625;
    }

    public void setWlgr625(double wlgr625) {
        this.wlgr625 = wlgr625;
    }

    public double getWlgx625() {
        return wlgx625;
    }

    public void setWlgx625(double wlgx625) {
        this.wlgx625 = wlgx625;
    }

    public double getWlgr50() {
        return wlgr50;
    }

    public void setWlgr50(double wlgr50) {
        this.wlgr50 = wlgr50;
    }

    public double getWlgx50() {
        return wlgx50;
    }

    public void setWlgx50(double wlgx50) {
        this.wlgx50 = wlgx50;
    }

    public double getBmi() {
        return BMI;
    }

    public void setBmi(double bmi) { this.BMI = bmi; }
}
