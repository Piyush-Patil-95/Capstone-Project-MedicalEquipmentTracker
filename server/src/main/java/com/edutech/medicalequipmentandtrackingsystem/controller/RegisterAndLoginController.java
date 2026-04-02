package com.edutech.medicalequipmentandtrackingsystem.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.edutech.medicalequipmentandtrackingsystem.dto.LoginRequest;
import com.edutech.medicalequipmentandtrackingsystem.dto.LoginResponse;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.jwt.JwtUtil;
import com.edutech.medicalequipmentandtrackingsystem.service.CaptchaService;
import com.edutech.medicalequipmentandtrackingsystem.service.EquipmentService;
import com.edutech.medicalequipmentandtrackingsystem.service.HospitalService;
import com.edutech.medicalequipmentandtrackingsystem.service.MaintenanceService;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderService;
import com.edutech.medicalequipmentandtrackingsystem.service.UserService;

@RestController

@RequestMapping
public class RegisterAndLoginController {
  @Autowired    
   private UserService userService;
   @Autowired
   private JwtUtil jwtUtil;
   @Autowired
   private AuthenticationManager authenticationManager;
   @Autowired 
   private CaptchaService captchaService;

   
     @PostMapping("/api/user/register")
    public ResponseEntity<User> registerUser(@RequestBody User user){
     User savedUser= userService.registerUser(user);
     return new ResponseEntity<>(savedUser,HttpStatus.CREATED);
     
    }
    //   @PostMapping("/api/user/login")
    //  public ResponseEntity<?> loginUser(@RequestBody LoginRequest request){
    //   try{
    //     authenticationManager.authenticate(
    //      new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword())
    //     );
    //   }
    //   catch (Exception e){
       
    //    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    //   }
    //     User user=userService.getUserByUsername(request.getUsername());//fetching user bro
    //     String token=jwtUtil.generateToken(user.getUsername());//generating 
    //      LoginResponse response=new LoginResponse(token, user.getUsername(), user.getEmail(), user.getRole());
    //     return new ResponseEntity<>(response,HttpStatus.OK);
     
    //  }


    @PostMapping("/api/user/login")
public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {

    // ✅ CAPTCHA CHECK FIRST
    boolean captchaValid = captchaService.validateCaptcha(
            request.getCaptchaId(),
            request.getCaptchaAnswer()
    );

    if (!captchaValid) {
        return new ResponseEntity<>("Invalid Captcha", HttpStatus.BAD_REQUEST);
    }

    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );
    } catch (AuthenticationException e) {
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    User user = userService.getUserByUsername(request.getUsername());
    String token = jwtUtil.generateToken(user.getUsername());

    LoginResponse response = new LoginResponse(
            token,
            user.getUsername(),
            user.getEmail(),
            user.getRole()
    );

    return new ResponseEntity<>(response, HttpStatus.OK);
}
        
    }

