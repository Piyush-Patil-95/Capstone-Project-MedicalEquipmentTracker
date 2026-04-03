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


//controller for hospital
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

   // Add Equipment to Hospital
   @PostMapping("/api/hospital/equipment")
   public ResponseEntity<Equipment> addEquipment(
         @RequestParam Long hospitalId,
         @RequestBody Equipment equipment) {

      Equipment addedEquipment = equipmentService.addEquipment(hospitalId, equipment);
      return new ResponseEntity<>(addedEquipment, HttpStatus.CREATED);
   }

   // Get Equipment by Hospital
   @GetMapping("/api/hospital/equipment/{hospitalId}")
   public ResponseEntity<List<Equipment>> getEquipment(@PathVariable Long hospitalId) {
      return new ResponseEntity<>(equipmentService.getAllEquipmentOfHospital(hospitalId), HttpStatus.OK);
   }

   // Schedule Maintenance
   @PostMapping("/api/hospital/maintenance/schedule")
   public ResponseEntity<Maintenance> scheduleMaintenance(@RequestParam Long equipmentId,@RequestBody Maintenance maintenance) {

      Maintenance scheduled = maintenanceService.scheduleMaintenance(equipmentId, maintenance);
      return new ResponseEntity<>(scheduled, HttpStatus.CREATED);
   }

  @DeleteMapping("/api/hospital/{id}")
public ResponseEntity<?> deleteHospital(@PathVariable Long id) {
    hospitalService.deleteHospital(id);
    return ResponseEntity.ok(Map.of("message", "Deleted Successfully"));
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
