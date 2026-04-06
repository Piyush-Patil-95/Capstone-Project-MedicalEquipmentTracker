package com.edutech.medicalequipmentandtrackingsystem.service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final EquipmentRepository equipmentRepository;

    public OrderService(OrderRepository orderRepository, EquipmentRepository equipmentRepository) {
        this.orderRepository = orderRepository;
        this.equipmentRepository = equipmentRepository;
    }

    // =========================
    // EXISTING REQUIRED METHODS
    // =========================

    public Order placeOrder(Long equipmentId, Order order) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        order.setEquipment(equipment);

        // ensure default status if not provided
        if (order.getStatus() == null || order.getStatus().trim().isEmpty()) {
            order.setStatus("Initiated");
        }

        // ensure date if not provided
        if (order.getOrderDate() == null) {
            order.setOrderDate(new Date());
        }

        order.setDeleted(false);
        order.setDeletedAt(null);

        return orderRepository.save(order);
    }

    // ✅ Active orders only (IMPORTANT for refresh issue)
    public List<Order> getAllOrders() {
        return orderRepository.findByDeletedFalse();
    }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // =========================
    // ✅ SOFT DELETE FEATURES
    // =========================

    // ✅ Deleted orders list
    public List<Order> getDeletedOrders() {
        return orderRepository.findByDeletedTrue();
    }

    // ✅ Soft delete one
    public void softDeleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setDeleted(true);
        order.setDeletedAt(new Date());
        orderRepository.save(order);
    }

    // ✅ Soft delete bulk
    public void softDeleteOrders(List<Long> ids) {
        List<Order> orders = orderRepository.findAllById(ids);
        Date now = new Date();

        for (Order o : orders) {
            o.setDeleted(true);
            o.setDeletedAt(now);
        }
        orderRepository.saveAll(orders);
    }

    // ✅ Restore
    public void restoreOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setDeleted(false);
        order.setDeletedAt(null);
        orderRepository.save(order);
    }

    // ✅ Permanent delete
    public void permanentDelete(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    public Order updatePaymentStatus(Long orderId, String paymentStatus) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

    // ✅ Only allow Paid/Unpaid
    if (!"Paid".equalsIgnoreCase(paymentStatus) && !"Unpaid".equalsIgnoreCase(paymentStatus)) {
        throw new RuntimeException("Invalid payment status. Use Paid or Unpaid only.");
    }

    order.setPaymentStatus(
            "Paid".equalsIgnoreCase(paymentStatus) ? "Paid" : "Unpaid"
    );
    order.setPaymentUpdatedAt(new Date());

    return orderRepository.save(order);
}

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

@Transactional
public int deleteAllDeletedOrdersPermanently() {
    List<Order> deletedOrders = orderRepository.findByDeletedTrue();
    int count = deletedOrders.size();
    orderRepository.deleteAll(deletedOrders);
    return count;



}
}
