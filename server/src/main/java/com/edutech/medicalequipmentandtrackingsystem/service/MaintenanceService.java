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
            Equipment equipment=equipmentRepository.findById(equipmentId).get();
            maintenance.setEquipment(equipment);
            return maintenanceRepository.save(maintenance);

    }

    public Maintenance updateMaintenance(Long maintenanceId, Maintenance updatedMaintenance){
        Optional<Maintenance> op = maintenanceRepository.findById(maintenanceId);
        if(op.isPresent()){
            Maintenance old = op.get();
            old.setScheduledDate(updatedMaintenance.getScheduledDate());
            old.setCompletedDate(updatedMaintenance.getCompletedDate());
            old.setDescription(updatedMaintenance.getDescription());
            old.setEquipment(updatedMaintenance.getEquipment());
            old.setStatus(updatedMaintenance.getStatus());
            return maintenanceRepository.save(old);
        }
        return null;
    }


}
