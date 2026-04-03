package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ NEW: Get all users (frontend filters by role=SUPPLIER)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
    }
}