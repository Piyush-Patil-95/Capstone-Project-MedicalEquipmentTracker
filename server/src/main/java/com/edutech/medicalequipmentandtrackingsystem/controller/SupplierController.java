package com.edutech.medicalequipmentandtrackingsystem.controller;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
public class SupplierController {

    private final OrderService orderService;

    public SupplierController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ Active orders only
    @GetMapping("/api/supplier/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ✅ Keep your existing update status endpoint
    @PutMapping("/api/supplier/order/update/{orderId}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId,
                                                   @RequestParam String newStatus) {
        Order updated = orderService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(updated);
    }

    // =========================
    // ✅ SOFT DELETE ENDPOINTS
    // =========================

    @GetMapping("/api/supplier/orders/deleted")
    public ResponseEntity<List<Order>> getDeletedOrders() {
        return ResponseEntity.ok(orderService.getDeletedOrders());
    }

   
// ✅ FIXED: Return Map so Angular treats it as JSON (no parse error)
    @DeleteMapping("/api/supplier/order/delete/{orderId}")
    public ResponseEntity<Map<String, String>> softDelete(@PathVariable Long orderId) {
        orderService.softDeleteOrder(orderId);
        return ResponseEntity.ok(Map.of("message", "Order moved to deleted list"));
    }

   

// ✅ FIXED: Return Map so Angular treats it as JSON (no parse error)
    @PostMapping("/api/supplier/orders/delete")
    public ResponseEntity<Map<String, String>> softDeleteBulk(@RequestBody List<Long> ids) {
        orderService.softDeleteOrders(ids);
        return ResponseEntity.ok(Map.of("message", ids.size() + " orders moved to deleted list"));
    }


   

@PutMapping("/api/supplier/order/restore/{orderId}")
public ResponseEntity<Map<String, String>> restore(@PathVariable Long orderId) {
    orderService.restoreOrder(orderId);
    return ResponseEntity.ok(Map.of("message", "Order restored"));
}


    @DeleteMapping("/api/supplier/order/permanent/{orderId}")
    public ResponseEntity<String> permanentDelete(@PathVariable Long orderId) {
        orderService.permanentDelete(orderId);
        return ResponseEntity.ok("Order permanently deleted");
    }
}