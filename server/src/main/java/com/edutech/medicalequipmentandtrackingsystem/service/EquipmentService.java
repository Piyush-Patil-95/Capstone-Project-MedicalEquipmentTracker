package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.HospitalRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;

public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;
    @Autowired
    private HospitalRepository hospitalRepository;

    public Equipment addEquipment(Long hospitalId,Equipment equipment){
        Hospital hospital=hospitalRepository.findById(hospitalId).orElseThrow(()-> new RuntimeException("not contains"));
        equipment.setHospital(hospital);
        return equipmentRepository.save(equipment);
    }
    public List<Equipment> getAllEquipmentOfHospital(Long hospitalId){
        return EquipmentRepository.findByHospitalId(hospitalId);
    }

}
