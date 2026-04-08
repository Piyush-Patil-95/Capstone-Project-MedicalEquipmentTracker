package com.edutech.medicalequipmentandtrackingsystem.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.dto.ForgotPasswordRequest;
import com.edutech.medicalequipmentandtrackingsystem.service.ForgotPasswordService;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "*")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    // ✅ Step 1: Send OTP to email
    @PostMapping("/forgot")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody Map<String, String> body) {

        String email = body.get("email");
        Map<String, String> response = new HashMap<>();

        if (email == null || email.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        boolean sent = forgotPasswordService.sendResetOtp(email);

        if (sent) {
            response.put("status", "success");
            response.put("message", "OTP sent to " + email);
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "Email not found!");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ✅ Step 2: Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(
            @RequestBody ForgotPasswordRequest req) {

        Map<String, String> response = new HashMap<>();
        boolean valid = forgotPasswordService.verifyOtp(req.getEmail(), req.getOtp());

        if (valid) {
            response.put("status", "success");
            response.put("message", "OTP verified!");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid or expired OTP!");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ✅ Step 3: Reset Password
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody ForgotPasswordRequest req) {

        Map<String, String> response = new HashMap<>();
        boolean reset = forgotPasswordService.resetPassword(
                req.getEmail(), req.getOtp(), req.getNewPassword());

        if (reset) {
            response.put("status", "success");
            response.put("message", "Password reset successfully!");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid OTP or email!");
            return ResponseEntity.badRequest().body(response);
        }
    }
}