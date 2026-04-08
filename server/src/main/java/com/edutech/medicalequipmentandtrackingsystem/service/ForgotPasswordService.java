package com.edutech.medicalequipmentandtrackingsystem.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;

@Service
public class ForgotPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Temp OTP storage
    private Map<String, String> otpStore = new HashMap<>();
    private Map<String, LocalDateTime> otpExpiry = new HashMap<>();

    // ✅ Step 1: Send OTP
    public boolean sendResetOtp(String email) {
        // Check if email exists
        User user = userRepository.findByEmail(email);
        if (user == null) return false;

        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        otpStore.put(email, otp);
        otpExpiry.put(email, LocalDateTime.now().plusMinutes(5));

        // Send email
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("projecttestbackend@gmail.com");
        msg.setTo(email);
        msg.setSubject("MedTrack - Password Reset OTP");
        msg.setText(
            "Hello " + user.getUsername() + "!\n\n" +
            "Your OTP for password reset is:\n\n" +
            "🔐 " + otp + "\n\n" +
            "This OTP is valid for 5 minutes.\n" +
            "If you didn't request this, ignore this email.\n\n" +
            "Team MedTrack"
        );
        mailSender.send(msg);

        System.out.println("✅ Reset OTP sent to: " + email);
        return true;
    }

    // ✅ Step 2: Verify OTP only
    public boolean verifyOtp(String email, String otp) {
        if (!otpStore.containsKey(email)) return false;

        if (LocalDateTime.now().isAfter(otpExpiry.get(email))) {
            otpStore.remove(email);
            otpExpiry.remove(email);
            return false;
        }

        return otpStore.get(email).equals(otp);
    }

    // ✅ Step 3: Reset Password
    public boolean resetPassword(String email, String otp, String newPassword) {
        if (!verifyOtp(email, otp)) return false;

        User user = userRepository.findByEmail(email);
        if (user == null) return false;

        // Encode & save new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Clear OTP after use
        otpStore.remove(email);
        otpExpiry.remove(email);

        return true;
    }
}