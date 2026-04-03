package com.edutech.medicalequipmentandtrackingsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.HospitalRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.OrderRepository;

import java.util.Date;
import java.util.List;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private OrderRepository orderRepository;  // ✅ ADD THIS

    // ✅ UPDATED: Create equipment AND order automatically
    // public Equipment addEquipment(Long hospitalId, Long supplierId, Equipment equipment) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        
        equipment.setHospital(hospital);
        equipment.setSupplierId(supplierId);
        
        // Save equipment first
        Equipment savedEquipment = equipmentRepository.save(equipment);
        
        // ✅ AUTO-CREATE ORDER
       Order order = new Order();
    order.setEquipment(savedEquipment);
    order.setOrderDate(new Date());
    order.setStatus("Initiated");
    order.setQuantity(quantity);
        
        orderRepository.save(order);
        
        return savedEquipment;
    }

    public List<Equipment> getAllEquipmentOfHospital(Long hospitalId) {
        return equipmentRepository.findByHospitalId(hospitalId);
    }

    public List<Equipment> getEquipmentBySupplierId(Long supplierId) {
        return equipmentRepository.findBySupplierId(supplierId);
    }
    @Autowired
private OrderRepository orderRepository;

public Equipment addEquipment(Long hospitalId, Long supplierId, Equipment equipment, int quantity) {

    Hospital hospital = hospitalRepository.findById(hospitalId)
            .orElseThrow(() -> new RuntimeException("Hospital not found"));

    equipment.setHospital(hospital);
    equipment.setSupplierId(supplierId);

    Equipment savedEquipment = equipmentRepository.save(equipment);

    // ✅ CREATE ORDER AUTOMATICALLY
    Order order = new Order();
    order.setEquipment(savedEquipment);
    order.setStatus("PENDING");
    order.setQuantity(quantity);

    orderRepository.save(order);

    return savedEquipment;
}
}