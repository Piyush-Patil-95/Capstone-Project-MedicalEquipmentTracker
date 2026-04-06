package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.service.MaintenanceService;

import java.util.List;

@RestController
public class TechnicianController {


    @Autowired
    private MaintenanceService maintenanceService;

    // Get all maintenance

    @PostMapping("/api/technician/maintenance/add")
public ResponseEntity<Maintenance> addMaintenance(@RequestBody Maintenance maintenance) {
    return new ResponseEntity<>(maintenanceService.addMaintenance(maintenance), HttpStatus.CREATED);
}


 @GetMapping("/api/technician/maintenance")
    public ResponseEntity<List<Maintenance>> getMaintenance() {
        return new ResponseEntity<>(maintenanceService.getAllMaintenance(), HttpStatus.OK);
 }


@DeleteMapping("/api/technician/maintenance/{id}")
public ResponseEntity<?> deleteMaintenance(@PathVariable Long id) {
    maintenanceService.deleteMaintenance(id);
    return ResponseEntity.ok("Deleted Successfully");
}

    // Update maintenance
 @PutMapping("/api/technician/maintenance/update/{maintenanceId}")
    public ResponseEntity<Maintenance> updateMaintenance(
 @PathVariable Long maintenanceId,
 @RequestBody Maintenance maintenance) {

        Maintenance updated = maintenanceService.updateMaintenance(maintenanceId, maintenance);
        return new ResponseEntity<>(updated, HttpStatus.OK);
 }
   
   

    
}
