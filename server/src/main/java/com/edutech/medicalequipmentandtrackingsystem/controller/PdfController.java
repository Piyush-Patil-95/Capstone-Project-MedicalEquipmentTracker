package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.repository.OrderRepository;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderPdfService;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    private final OrderRepository orderRepository;
    private final OrderPdfService orderPdfService;

    public PdfController(OrderRepository orderRepository, OrderPdfService orderPdfService) {
        this.orderRepository = orderRepository;
        this.orderPdfService = orderPdfService;
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
}