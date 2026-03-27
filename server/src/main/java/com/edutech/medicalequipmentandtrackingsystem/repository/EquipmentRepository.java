package com.edutech.medicalequipmentandtrackingsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment,Long> {
    @Query("select e from Equipment e where e.hospital.id=?1")
     List<Equipment>findByHospitalId(Long hospitalId);
}
