package com.cs79_1.interactive_dashboard.Entity;

import com.cs79_1.interactive_dashboard.Enum.Role;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;

//    @Column(nullable = false)
    private double ageMonth;

//    @Column(nullable = false)
    private int ageYear;

//    @Column(nullable = false)
    private int sex; // 1 - Male 2 - Female

    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private Role role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private BodyMetrics bodyMetrics;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private BodyComposition bodyComposition;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private WeightMetrics weightMetrics;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private WeeklyIntake weeklyIntake;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private MentalHealthAndDailyRoutine mentalHealthAndDailyRoutine;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<WorkoutAmount> WorkoutAmounts;

    public User() {}

    public User(String username, String password, int sex) {
        this.username = username;
        this.password = password;
        this.sex = sex;
    }

    public long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public double getAgeMonth() {
        return ageMonth;
    }

    public void setAgeMonth(double ageMonth) {
        this.ageMonth = ageMonth;
    }

    public int getAgeYear() {
        return ageYear;
    }

    public void setAgeYear(int ageYear) {
        this.ageYear = ageYear;
    }

    public int getSex() {
        return sex;
    }

    public void setSex(int sex) {
        this.sex = sex;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public BodyMetrics getBodyMetrics() {
        return bodyMetrics;
    }

    public void setBodyMetrics(BodyMetrics bodyMetrics) {
        this.bodyMetrics = bodyMetrics;
    }

    public BodyComposition getBodyComposition() {
        return bodyComposition;
    }

    public void setBodyComposition(BodyComposition bodyComposition) {
        this.bodyComposition = bodyComposition;
    }

    public WeightMetrics getWeightMetrics() {
        return weightMetrics;
    }

    public void setWeightMetrics(WeightMetrics weightMetrics) {
        this.weightMetrics = weightMetrics;
    }

    public WeeklyIntake getWeeklyIntake() {
        return weeklyIntake;
    }

    public void setWeeklyIntake(WeeklyIntake weeklyIntake) {
        this.weeklyIntake = weeklyIntake;
    }

    public MentalHealthAndDailyRoutine getMentalHealthAndDailyRoutine() {
        return mentalHealthAndDailyRoutine;
    }

    public void setMentalHealthAndDailyRoutine(MentalHealthAndDailyRoutine mentalHealthAndDailyRoutine) {
        this.mentalHealthAndDailyRoutine = mentalHealthAndDailyRoutine;
    }

    public List<WorkoutAmount> getWorkoutAmounts() {
        return WorkoutAmounts;
    }

    public void setWorkoutAmounts(List<WorkoutAmount> WorkoutAmounts) {
        this.WorkoutAmounts = WorkoutAmounts;
    }


}
