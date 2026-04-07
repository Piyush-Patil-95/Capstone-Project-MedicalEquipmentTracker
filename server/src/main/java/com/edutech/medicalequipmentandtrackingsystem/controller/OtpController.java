package com.edutech.medicalequipmentandtrackingsystem.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.dto.OtpRequest;
import com.edutech.medicalequipmentandtrackingsystem.service.OtpService;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "*")
public class OtpController {

    @Autowired
    private OtpService otpService;

    // ✅ Send OTP to email
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (email == null || email.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "Email is required");
            return ResponseEntity.badRequest().body(error);
        }

        otpService.generateAndSendOtp(email);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "OTP sent to " + email);
        return ResponseEntity.ok(response);
    }

    // ✅ Verify OTP
    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody OtpRequest req) {
        boolean isValid = otpService.validateOtp(req.getEmail(), req.getOtp());

        Map<String, String> response = new HashMap<>();
        if (isValid) {
            response.put("status", "success");
            response.put("message", "OTP verified successfully!");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid or expired OTP!");
            return ResponseEntity.badRequest().body(response);
        }
    }
}