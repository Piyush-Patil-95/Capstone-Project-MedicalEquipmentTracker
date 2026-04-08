package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // Store OTP temporarily: email -> {otp, expiry}
    private Map<String, String> otpStore = new HashMap<>();
    private Map<String, LocalDateTime> otpExpiry = new HashMap<>();

    // ✅ Generate & Send OTP
    public void generateAndSendOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000)); // 6 digit OTP

        // Store OTP with 5 min expiry
        otpStore.put(email, otp);
        otpExpiry.put(email, LocalDateTime.now().plusMinutes(2));

        // Send Email
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("projecttestbackend@gmail.com");
        msg.setTo(email);
        msg.setSubject("MedTrack - OTP Verification");
        msg.setText(
            "Hello!\n\n" +
            "Your OTP for MedTrack registration is:\n\n" +
            "🔐 " + otp + "\n\n" +
            "This OTP is valid for 2 minutes.\n" +
            "Do not share this with anyone.\n\n" +
            "Team MedTrack"
        );

        mailSender.send(msg);
        System.out.println("✅ OTP sent to: " + email + " => " + otp);
    }

    // ✅ Validate OTP
    public boolean validateOtp(String email, String otp) {
        if (!otpStore.containsKey(email)) return false;

        LocalDateTime expiry = otpExpiry.get(email);
        if (LocalDateTime.now().isAfter(expiry)) {
            otpStore.remove(email);
            otpExpiry.remove(email);
            return false; // OTP expired
        }

        boolean isValid = otpStore.get(email).equals(otp);
        if (isValid) {
            otpStore.remove(email);   // Remove after successful use
            otpExpiry.remove(email);
        }
        return isValid;
    }
}