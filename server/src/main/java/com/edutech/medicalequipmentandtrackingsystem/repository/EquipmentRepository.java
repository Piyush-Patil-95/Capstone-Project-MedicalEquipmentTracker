package com.edutech.medicalequipmentandtrackingsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment,Long> {
    static List<Equipment>findByHospitalId(Long hospitalId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByHospitalId'");
    }

    // extent jpa repository and add custom methods if needed
}
