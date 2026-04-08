package com.edutech.medicalequipmentandtrackingsystem.controller;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
public class SupplierController {

    @Autowired
    private OrderService orderService;

    // ============================
    // GET ACTIVE ORDERS
    // ============================
    @GetMapping("/api/supplier/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ============================
    // UPDATE ORDER STATUS
    // ============================
    @PutMapping("/api/supplier/order/update/{orderId}")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String newStatus) {
        Order updated = orderService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(updated);
    }

    // ============================
    // SOFT DELETE — Single
    // ============================
    @DeleteMapping("/api/supplier/order/delete/{orderId}")
    public ResponseEntity<Order> softDelete(@PathVariable Long orderId) {
        Order order = orderService.softDeleteOrder(orderId);
        return ResponseEntity.ok(order);
    }

    // ============================
    // SOFT DELETE — Bulk
    // ============================
    @PostMapping("/api/supplier/orders/delete")
    public ResponseEntity<Map<String, String>> softDeleteBulk(@RequestBody List<Long> ids) {
        orderService.softDeleteOrders(ids);
        return ResponseEntity.ok(Map.of("message", ids.size() + " orders moved to deleted list"));
    }

    // ============================
    // GET DELETED ORDERS
    // ============================
    @GetMapping("/api/supplier/orders/deleted")
    public ResponseEntity<List<Order>> getDeletedOrders() {
        return ResponseEntity.ok(orderService.getDeletedOrders());
    }

    // ============================
    // RESTORE — Single
    // ============================
    @PutMapping("/api/supplier/order/restore/{orderId}")
    public ResponseEntity<Map<String, String>> restore(@PathVariable Long orderId) {
        orderService.restoreOrder(orderId);
        return ResponseEntity.ok(Map.of("message", "Order restored"));
    }

    // ============================
    // RESTORE — All
    // ============================
    @PutMapping("/api/supplier/orders/restoreAll")
    public ResponseEntity<Map<String, String>> restoreAll() {
        int count = orderService.restoreAllDeletedOrders();
        return ResponseEntity.ok(Map.of("message", count + " orders restored successfully"));
    }

    // ============================
    // PERMANENT DELETE — Single
    // ============================
    @DeleteMapping("/api/supplier/order/permanent/{orderId}")
    public ResponseEntity<Map<String, String>> permanentDelete(@PathVariable Long orderId) {
        orderService.permanentDelete(orderId);
        return ResponseEntity.ok(Map.of("message", "Order permanently deleted"));
    }

    // ============================
    // PERMANENT DELETE — All deleted
    // ============================
    @DeleteMapping("/api/supplier/orders/deleted/deleteAll")
    public ResponseEntity<Map<String, String>> deleteAllDeletedOrders() {
        int count = orderService.deleteAllDeletedOrdersPermanently();
        return ResponseEntity.ok(Map.of("message", count + " deleted orders permanently removed"));
    }

    // ============================
    // UPDATE PAYMENT STATUS
    // ============================
    @PutMapping("/api/supplier/order/payment/{orderId}")
    public ResponseEntity<Order> updatePaymentStatus(
            @PathVariable Long orderId,
            @RequestParam String paymentStatus) {
        Order updated = orderService.updatePaymentStatus(orderId, paymentStatus);
        return ResponseEntity.ok(updated);
    }
}