package com.edutech.medicalequipmentandtrackingsystem.service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    // ============================
    // PLACE ORDER
    // ============================
    public Order placeOrder(Long equipmentId, Order order) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        order.setEquipment(equipment);

        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("Initiated");
        }
        if (order.getOrderDate() == null) {
            order.setOrderDate(new Date());
        }

        // ✅ Always initialize soft-delete fields on creation
        order.setDeleted(false);
        order.setDeletedAt(null);
        order.setPaymentStatus("Unpaid");

        return orderRepository.save(order);
    }

    // ============================
    // GET ORDERS
    // ============================

    // ✅ Active orders only (used by supplier view)
    public List<Order> getAllOrders() {
        return orderRepository.findByDeletedFalse();
    }

    // ✅ Deleted orders only (used by trash panel)
    public List<Order> getDeletedOrders() {
        return orderRepository.findByDeletedTrue();
    }

    // ✅ Single order by ID
    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // ============================
    // UPDATE STATUS
    // ============================
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // ============================
    // UPDATE PAYMENT STATUS
    // ============================
    public Order updatePaymentStatus(Long orderId, String paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"Paid".equalsIgnoreCase(paymentStatus) && !"Unpaid".equalsIgnoreCase(paymentStatus)) {
            throw new RuntimeException("Invalid payment status. Use Paid or Unpaid only.");
        }

        order.setPaymentStatus("Paid".equalsIgnoreCase(paymentStatus) ? "Paid" : "Unpaid");
        order.setPaymentUpdatedAt(new Date());
        return orderRepository.save(order);
    }

    // ============================
    // SOFT DELETE — Single
    // ============================
    public void softDeleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setDeleted(true);
        order.setDeletedAt(new Date());
        orderRepository.save(order);
    }

    // ============================
    // SOFT DELETE — Bulk
    // ============================
    public void softDeleteOrders(List<Long> ids) {
        List<Order> orders = orderRepository.findAllById(ids);
        Date now = new Date();
        for (Order o : orders) {
            o.setDeleted(true);
            o.setDeletedAt(now);
        }
        orderRepository.saveAll(orders);
    }

    // ============================
    // RESTORE — Single
    // ============================
    public void restoreOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setDeleted(false);
        order.setDeletedAt(null);
        orderRepository.save(order);
    }

    // ============================
    // RESTORE — All
    // ============================
    @Transactional
    public int restoreAllDeletedOrders() {
        List<Order> deletedOrders = orderRepository.findByDeletedTrue();
        for (Order o : deletedOrders) {
            o.setDeleted(false);
            o.setDeletedAt(null);
        }
        orderRepository.saveAll(deletedOrders);
        return deletedOrders.size();
    }

    // ============================
    // PERMANENT DELETE — Single
    // ============================
    public void permanentDelete(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    // ============================
    // PERMANENT DELETE — All deleted
    // ============================
    @Transactional
    public int deleteAllDeletedOrdersPermanently() {
        List<Order> deletedOrders = orderRepository.findByDeletedTrue();
        int count = deletedOrders.size();
        orderRepository.deleteAll(deletedOrders);
        return count;
    }

    // ============================
    // SAVE (utility)
    // ============================
    public Order save(Order order) {
        return orderRepository.save(order);
    }
    
}