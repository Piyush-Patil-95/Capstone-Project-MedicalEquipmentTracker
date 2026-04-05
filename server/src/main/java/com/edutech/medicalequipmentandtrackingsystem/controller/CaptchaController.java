package com.edutech.medicalequipmentandtrackingsystem.controller;

import com.edutech.medicalequipmentandtrackingsystem.dto.CaptchaResponse;
import com.edutech.medicalequipmentandtrackingsystem.service.CaptchaService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/captcha")
public class CaptchaController {

    private final CaptchaService captchaService;

    public CaptchaController(CaptchaService captchaService) {
        this.captchaService = captchaService;
    }

    @GetMapping("/generate")
    public CaptchaResponse generateCaptcha() {
        var captcha = captchaService.generateCaptcha();
        return new CaptchaResponse(
                captcha.getCaptchaId(),
                captcha.getQuestion()
        );
    }
}