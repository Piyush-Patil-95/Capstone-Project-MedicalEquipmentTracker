package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CaptchaService {

    private final Map<String, Integer> captchaStore = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public Captcha generateCaptcha() {
        int a = random.nextInt(10) + 1;
        int b = random.nextInt(10) + 1;

        String captchaId = UUID.randomUUID().toString();
        captchaStore.put(captchaId, a + b);

        String question = a + " + " + b + " = ?";
        return new Captcha(captchaId, question);
    }

    public boolean validateCaptcha(String captchaId, String userAnswer) {
        if (!captchaStore.containsKey(captchaId)) {
            return false;
        }

        int correctAnswer = captchaStore.get(captchaId);
        captchaStore.remove(captchaId); // one-time use ✅

        return String.valueOf(correctAnswer).equals(userAnswer);
    }

    // ✅ NORMAL INNER CLASS (NO RECORD)
    public static class Captcha {
        private final String captchaId;
        private final String question;

        public Captcha(String captchaId, String question) {
            this.captchaId = captchaId;
            this.question = question;
        }

        public String getCaptchaId() {
            return captchaId;
        }

        public String getQuestion() {
            return question;
        }
    }
}