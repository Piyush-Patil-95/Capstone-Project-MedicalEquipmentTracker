package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/supplier")
public class SupplierController {

    @Autowired
    private OrderService orderService;

    // ✅ Get orders for specific supplier
    @GetMapping("/orders/{supplierId}")
    public ResponseEntity<List<Order>> getOrders(@PathVariable Long supplierId) {
        return ResponseEntity.ok(orderService.getOrdersBySupplier(supplierId));
    }
}