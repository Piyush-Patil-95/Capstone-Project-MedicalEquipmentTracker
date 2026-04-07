package com.edutech.medicalequipmentandtrackingsystem.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.MaintenanceRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceService {
    @Autowired
    private MaintenanceRepository maintenanceRepository;
    @Autowired
    private EquipmentRepository equipmentRepository;
    public List<Maintenance> getAllMaintenance(){
        return maintenanceRepository.findAll();
    }
    public Maintenance scheduleMaintenance(Long equipmentId, Maintenance maintenance){
    Equipment equipment = equipmentRepository.findById(equipmentId).get();

    maintenance.setEquipment(equipment);
    maintenance.setHospital(equipment.getHospital()); // ✅ ADD THIS LINE

    return maintenanceRepository.save(maintenance);
}
public void deleteMaintenance(Long id) {
    maintenanceRepository.deleteById(id);
}

   public Maintenance updateMaintenance(Long id, Maintenance updatedData) {

    Maintenance existing = maintenanceRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Maintenance not found"));

    // ✅ update only fields
    existing.setScheduledDate(updatedData.getScheduledDate());
    existing.setCompletedDate(updatedData.getCompletedDate());
    existing.setDescription(updatedData.getDescription());
    existing.setStatus(updatedData.getStatus());

    // ❌ DO NOT TOUCH EQUIPMENT
    // existing.setEquipment(updatedData.getEquipment());

    return maintenanceRepository.save(existing);
}


public Maintenance addMaintenance(Maintenance maintenance) {
    if (maintenance.getEquipment() != null && maintenance.getEquipment().getId() != null) {
        Equipment equipment = equipmentRepository.findById(
            maintenance.getEquipment().getId()
        ).orElseThrow(() -> new RuntimeException("Equipment not found"));
        
        maintenance.setEquipment(equipment);
        maintenance.setHospital(equipment.getHospital()); // auto-link hospital
    }
    return maintenanceRepository.save(maintenance);
}

}
