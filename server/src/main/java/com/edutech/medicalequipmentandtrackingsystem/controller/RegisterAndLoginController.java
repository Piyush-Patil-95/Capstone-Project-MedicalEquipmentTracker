package com.edutech.medicalequipmentandtrackingsystem.controller;

import java.util.Collections;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.dto.LoginRequest;
import com.edutech.medicalequipmentandtrackingsystem.dto.LoginResponse;
import com.edutech.medicalequipmentandtrackingsystem.dto.OtpVerifyRequest;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.jwt.JwtUtil;
import com.edutech.medicalequipmentandtrackingsystem.service.CaptchaService;
import com.edutech.medicalequipmentandtrackingsystem.service.UserService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CaptchaService captchaService;

    @Autowired
    private JavaMailSender mailSender;

    // =============================================
    // REGISTER + SEND OTP
    // =============================================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", "Email already registered"));
        }

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        user.setEmailVerified(false);
        user.setEmailOtp(otp);

        User savedUser = userService.registerUser(user);

        sendOtpEmail(savedUser.getEmail(), otp);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Collections.singletonMap("message",
                        "OTP sent to your email for verification."));
    }

    // =============================================
    // VERIFY OTP  (BODY BASED REQUEST)
    // =============================================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyRequest request) {

        User user = userService.getUserByEmail(request.getEmail());

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", "User not found"));
        }

        if (!request.getOtp().equals(user.getEmailOtp())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid OTP"));
        }

        user.setEmailVerified(true);
        user.setEmailOtp(null);
        userService.updateUser(user);

        return ResponseEntity
                .ok(Collections.singletonMap("message", "Email verified successfully!"));
    }

    // =============================================
    // LOGIN
    // =============================================
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {

        boolean captchaValid = captchaService.validateCaptcha(
                request.getCaptchaId(),
                request.getCaptchaAnswer()
        );

        if (!captchaValid) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", "Invalid Captcha"));
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid username or password"));
        }

        User user = userService.getUserByUsername(request.getUsername());

        if (!user.isEmailVerified()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Please verify your email before login"));
        }

        UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        LoginResponse response = new LoginResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    // =============================================
    // SEND EMAIL
    // =============================================
    private void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your Email Verification OTP");
        message.setText(
                "Your OTP is: " + otp + "\n\nDo not share this OTP with anyone."
        );
        mailSender.send(message);
    }
}