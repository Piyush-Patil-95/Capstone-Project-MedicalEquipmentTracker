package com.edutech.medicalequipmentandtrackingsystem.repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    // Existing
    List<Equipment> findByHospitalId(Long hospitalId);

    // ✅ NEW: Fetch equipment assigned to a specific supplier
    List<Equipment> findBySupplierId(Long supplierId);
}