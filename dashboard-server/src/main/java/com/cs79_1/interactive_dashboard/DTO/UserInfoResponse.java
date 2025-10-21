package com.cs79_1.interactive_dashboard.DTO;

public class UserInfoResponse {
    private String username;
    private String firstName;
    private String lastName;
    private String appearance;

    private long userId;
    private int ageYear;
    private int sex;
  
    public UserInfoResponse(String username, String firstName, String lastName, int ageYear, int sex, long userId, String appearance) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userId = userId;
        this.ageYear = ageYear;
        this.sex = sex;
        this.appearance = appearance;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
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

}
