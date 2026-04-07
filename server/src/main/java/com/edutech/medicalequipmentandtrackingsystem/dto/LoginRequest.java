package com.edutech.medicalequipmentandtrackingsystem.dto;

public class LoginRequest {

    private String username;
    private String password;
    private String captchaId;
    private String captchaAnswer;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getCaptchaId() {
        return captchaId;
    }

    public String getCaptchaAnswer() {
        return captchaAnswer;
    }
}