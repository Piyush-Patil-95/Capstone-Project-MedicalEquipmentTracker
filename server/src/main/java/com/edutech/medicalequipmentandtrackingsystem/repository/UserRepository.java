package com.edutech.medicalequipmentandtrackingsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // For login
    User findByUsername(String username);

    // For email OTP verification
    Optional<User> findByEmail(String email);

    // For checking duplicate email
    boolean existsByEmail(String email);
}