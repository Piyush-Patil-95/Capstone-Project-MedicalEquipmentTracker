package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.dto.ContactRequest;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String TO_EMAIL = "projecttestbackend@gmail.com";

    public void sendContactMail(ContactRequest req) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(TO_EMAIL);

        String subject = (req.getSubject() == null || req.getSubject().trim().isEmpty())
                ? "New Contact Message"
                : req.getSubject().trim();

        msg.setSubject("MedTrack Contact: " + subject);

        msg.setText(
                "✅ New Contact Form Submission\n\n" +
                "Name: " + safe(req.getName()) + "\n" +
                "Email: " + safe(req.getEmail()) + "\n" +
                "Subject: " + safe(req.getSubject()) + "\n\n" +
                "Message:\n" + safe(req.getMessage()) + "\n"
        );

        mailSender.send(msg);
    }

    private String safe(String s) {
        return s == null ? "" : s.trim();
    }
}