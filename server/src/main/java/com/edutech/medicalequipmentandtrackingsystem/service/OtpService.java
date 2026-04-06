
package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    public void saveOtp(String email, String otp) {
        otpStore.put(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        return otp.equals(otpStore.get(email));
    }

    public void clearOtp(String email) {
        otpStore.remove(email);
    }
}
