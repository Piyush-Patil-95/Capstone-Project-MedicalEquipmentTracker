package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;

import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    @Lazy
    private HospitalService hospitalService;

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        if ("HOSPITAL".equals(user.getRole())) {
            Hospital hospital = new Hospital();
            hospital.setName(user.getHospitalName());
            hospital.setLocation(user.getLocation());
            hospital.setUsername(savedUser.getUsername());
            hospitalService.createHospital(hospital);
        }

        return savedUser;
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) throw new UsernameNotFoundException("User not found");
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}