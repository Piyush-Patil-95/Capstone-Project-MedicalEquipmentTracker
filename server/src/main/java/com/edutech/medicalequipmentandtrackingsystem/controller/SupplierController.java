package com.edutech.medicalequipmentandtrackingsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderService;

import java.util.List;

@RestController
public class SupplierController {

   @Autowired
    private OrderService orderService;

    // Get all orders
 @GetMapping("/api/supplier/orders")
    public ResponseEntity<List<Order>> getOrders() {
        return new ResponseEntity<>(orderService.getAllOrders(), HttpStatus.OK);
 }

    // Update order status
 @PutMapping("/api/supplier/order/update/{orderId}")
    public ResponseEntity<Order> updateOrder(
 @PathVariable Long orderId,
 @RequestParam String newStatus) {

        Order updated = orderService.updateOrderStatus(orderId, newStatus);
        return new ResponseEntity<>(updated, HttpStatus.OK);
 }
       
  
}
