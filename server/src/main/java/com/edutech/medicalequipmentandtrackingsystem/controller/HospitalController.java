package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.service.EquipmentService;
import com.edutech.medicalequipmentandtrackingsystem.service.HospitalService;
import com.edutech.medicalequipmentandtrackingsystem.service.MaintenanceService;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderService;

import java.util.List;
import java.util.Map;

@RestController
public class HospitalController {

    @Autowired
    private EquipmentService equipmentService;

    @Autowired
    private MaintenanceService maintenanceService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private HospitalService hospitalService;

    // Create Hospital
    @PostMapping("/api/hospital/create")
    public ResponseEntity<Hospital> createHospital(@RequestBody Hospital hospital) {
        Hospital createdHospital = hospitalService.createHospital(hospital);
        return new ResponseEntity<>(createdHospital, HttpStatus.CREATED);
    }

    // Get All Hospitals
    @GetMapping("/api/hospitals")
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        return new ResponseEntity<>(hospitalService.getAllHospitals(), HttpStatus.OK);
    }

    // ✅ UPDATED: Add Equipment to Hospital AND link to Supplier
    // @PostMapping("/api/hospital/equipment")
    // public ResponseEntity<Equipment> addEquipment(
    //         @RequestParam Long hospitalId,
    //         @RequestParam Long supplierId,       // ✅ NEW param
    //         @RequestBody Equipment equipment) {
    //     Equipment addedEquipment = equipmentService.addEquipment(hospitalId, supplierId, equipment);
    //     return new ResponseEntity<>(addedEquipment, HttpStatus.CREATED);
    // }

    // Get Equipment by Hospital
    @GetMapping("/api/hospital/equipment/{hospitalId}")
    public ResponseEntity<List<Equipment>> getEquipment(@PathVariable Long hospitalId) {
        return new ResponseEntity<>(equipmentService.getAllEquipmentOfHospital(hospitalId), HttpStatus.OK);
    }

    // ✅ NEW: Get Equipment by Supplier (for supplier dashboard)
    @GetMapping("/api/supplier/equipment/{supplierId}")
    public ResponseEntity<List<Equipment>> getEquipmentBySupplier(@PathVariable Long supplierId) {
        return new ResponseEntity<>(equipmentService.getEquipmentBySupplierId(supplierId), HttpStatus.OK);
    }

    // Schedule Maintenance
    @PostMapping("/api/hospital/maintenance/schedule")
    public ResponseEntity<Maintenance> scheduleMaintenance(
            @RequestParam Long equipmentId,
            @RequestBody Maintenance maintenance) {
        Maintenance scheduled = maintenanceService.scheduleMaintenance(equipmentId, maintenance);
        return new ResponseEntity<>(scheduled, HttpStatus.CREATED);
    }

    // Delete Hospital
    @DeleteMapping("/api/hospital/{id}")
    public ResponseEntity<?> deleteHospital(@PathVariable Long id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.ok(Map.of("message", "Deleted Successfully"));
    }
    // @PostMapping("/api/hospital/equipment")
    // public ResponseEntity<Equipment> addEquipment(
    //         @RequestParam Long hospitalId,
    //         @RequestParam Long supplierId,
    //         @RequestParam(defaultValue = "1") int quantity,  // ✅ ADD THIS
    //         @RequestBody Equipment equipment) {
    //     Equipment addedEquipment = equipmentService.addEquipment(hospitalId, supplierId, equipment, quantity);
    //     return new ResponseEntity<>(addedEquipment, HttpStatus.CREATED);
    // }
    @PostMapping("/api/hospital/equipment")
public ResponseEntity<Equipment> addEquipment(
        @RequestParam Long hospitalId,
        @RequestParam Long supplierId,
        @RequestParam(defaultValue = "1") int quantity,
        @RequestBody Equipment equipment) {

    Equipment addedEquipment = equipmentService.addEquipment(hospitalId, supplierId, equipment, quantity);
    return new ResponseEntity<>(addedEquipment, HttpStatus.CREATED);
}

    // Place Order
    @PostMapping("/api/hospital/order")
    public ResponseEntity<Order> placeOrder(
            @RequestParam Long equipmentId,
            @RequestBody Order order) {
        Order placedOrder = orderService.placeOrder(equipmentId, order);
        return new ResponseEntity<>(placedOrder, HttpStatus.CREATED);
    }
}