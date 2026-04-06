package com.edutech.medicalequipmentandtrackingsystem.repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    Optional<Hospital> findByUsername(String username);
}