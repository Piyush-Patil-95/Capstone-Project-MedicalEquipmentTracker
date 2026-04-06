package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;

import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // ======================================================
    // REGISTER USER (encode password + save)
    // ======================================================
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }


    // ======================================================
    // FIND USER BY USERNAME (for LOGIN)
    // ======================================================
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }


    // ======================================================
    // REQUIRED: FIND USER BY EMAIL (for OTP VERIFY)
    // ======================================================
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }


    // ======================================================
    // REQUIRED: CHECK IF EMAIL ALREADY EXISTS
    // ======================================================
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }


    // ======================================================
    // UPDATE USER (save after OTP verification)
    // ======================================================
    public User updateUser(User user) {
        return userRepository.save(user);  // saves updates (verified, OTP null)
    }


    // ======================================================
    // Spring Security Authentication
    // ======================================================
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}