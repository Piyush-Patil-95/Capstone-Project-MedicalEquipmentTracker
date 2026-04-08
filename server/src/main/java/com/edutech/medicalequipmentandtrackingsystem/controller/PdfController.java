package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;
import com.edutech.medicalequipmentandtrackingsystem.repository.OrderRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.MaintenanceRepository;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderPdfService;
import com.edutech.medicalequipmentandtrackingsystem.service.MaintenancePdfService;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    private final OrderRepository orderRepository;
    private final OrderPdfService orderPdfService;
    private final MaintenanceRepository maintenanceRepository;      // ✅ ADD
    private final MaintenancePdfService maintenancePdfService;      // ✅ ADD

    public PdfController(
            OrderRepository orderRepository,
            OrderPdfService orderPdfService,
            MaintenanceRepository maintenanceRepository,            // ✅ ADD
            MaintenancePdfService maintenancePdfService) {          // ✅ ADD
        this.orderRepository = orderRepository;
        this.orderPdfService = orderPdfService;
        this.maintenanceRepository = maintenanceRepository;         // ✅ ADD
        this.maintenancePdfService = maintenancePdfService;         // ✅ ADD
    }

    @GetMapping(value = "/order/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadOrderPdf(@PathVariable Long id) throws Exception {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        byte[] pdfBytes = orderPdfService.generateOrderPdf(order);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=order_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // ✅ ADD THIS ENDPOINT
    @GetMapping(value = "/maintenance/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadMaintenancePdf(@PathVariable Long id) throws Exception {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));
        byte[] pdfBytes = maintenancePdfService.generateMaintenancePdf(maintenance);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=maintenance_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}