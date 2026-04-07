package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
import java.util.Optional;

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

    // ── NEW: returns only the logged-in user's hospital ──
    @GetMapping("/api/hospital/my")
    public ResponseEntity<Hospital> getMyHospital(
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        
        System.out.println(">>> JWT username: " + username);
        Optional<Hospital> hospital = hospitalService.getHospitalByUsername(username);
        return hospital
                .map(h -> new ResponseEntity<>(h, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/api/hospital/create")
    public ResponseEntity<Hospital> createHospital(@RequestBody Hospital hospital) {
        Hospital createdHospital = hospitalService.createHospital(hospital);
        return new ResponseEntity<>(createdHospital, HttpStatus.CREATED);
    }

    @GetMapping("/api/hospital/orders")
    public ResponseEntity<List<Order>> getHospitalOrders() {
        return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK);
    }

    @PostMapping("/api/hospital/payment/complete")
    public ResponseEntity<?> markPaymentDone(@RequestBody Map<String, Long> payload) {
        Long orderId = payload.get("orderId");
        Order order = orderService.getById(orderId);
        order.setPaymentDone(true);
        orderService.save(order);
        return ResponseEntity.ok("Payment stored");
    }

    @PutMapping("/api/hospital/update/{id}")
    public ResponseEntity<Hospital> updateHospital(
            @PathVariable Long id,
            @RequestBody Hospital hospitalData) {
        Hospital existing = hospitalService.getById(id);
        existing.setName(hospitalData.getName());
        existing.setLocation(hospitalData.getLocation());
        Hospital updated = hospitalService.save(existing);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @GetMapping("/api/hospitals")
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        return new ResponseEntity<>(hospitalService.getAllHospitals(), HttpStatus.OK);
    }

    @PostMapping("/api/hospital/equipment")
    public ResponseEntity<Equipment> addEquipment(
            @RequestParam Long hospitalId,
            @RequestBody Equipment equipment) {
        Equipment addedEquipment = equipmentService.addEquipment(hospitalId, equipment);
        return new ResponseEntity<>(addedEquipment, HttpStatus.CREATED);
    }

    @GetMapping("/api/hospital/equipment/{hospitalId}")
    public ResponseEntity<List<Equipment>> getEquipment(@PathVariable Long hospitalId) {
        return new ResponseEntity<>(equipmentService.getAllEquipmentOfHospital(hospitalId), HttpStatus.OK);
    }

    @PostMapping("/api/hospital/maintenance/schedule")
    public ResponseEntity<Maintenance> scheduleMaintenance(
            @RequestParam Long equipmentId,
            @RequestBody Maintenance maintenance) {
        Maintenance scheduled = maintenanceService.scheduleMaintenance(equipmentId, maintenance);
        return new ResponseEntity<>(scheduled, HttpStatus.CREATED);
    }

    @DeleteMapping("/api/hospital/{id}")
    public ResponseEntity<?> deleteHospital(@PathVariable Long id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.ok(Map.of("message", "Deleted Successfully"));
    }

    @PostMapping("/api/hospital/order")
    public ResponseEntity<Order> placeOrder(
            @RequestParam Long equipmentId,
            @RequestBody Order order) {
        Order placedOrder = orderService.placeOrder(equipmentId, order);
        return new ResponseEntity<>(placedOrder, HttpStatus.CREATED);
    }

    @GetMapping("/api/hospital/maintenance")
    public ResponseEntity<List<Maintenance>> getHospitalMaintenance() {
        return new ResponseEntity<>(maintenanceService.getAllMaintenance(), HttpStatus.OK);
    }
}