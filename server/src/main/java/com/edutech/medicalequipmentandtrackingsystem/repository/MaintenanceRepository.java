package com.edutech.medicalequipmentandtrackingsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;

import java.util.List;


public interface MaintenanceRepository extends JpaRepository<Maintenance,Long>{
     List<Maintenance>findByEquipmentId(Long equipmentId);

    // extend jpa repository and add custom methods if needed
}
