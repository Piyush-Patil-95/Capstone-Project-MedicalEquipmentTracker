package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;        // ✅ ADD THIS
import java.util.Map;
import com.edutech.medicalequipmentandtrackingsystem.dto.ContactRequest;
import com.edutech.medicalequipmentandtrackingsystem.service.EmailService;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private EmailService emailService;

   @PostMapping("/send")
public ResponseEntity<Map<String, String>> send(@RequestBody ContactRequest req) {
    emailService.sendContactMail(req);
    
    Map<String, String> response = new HashMap<>();
    response.put("status", "success");
    response.put("message", "Message sent successfully!");
    
    return ResponseEntity.ok(response); 
}
}