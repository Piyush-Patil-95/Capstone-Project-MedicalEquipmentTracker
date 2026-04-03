package com.edutech.medicalequipmentandtrackingsystem.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Equipment;
import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import com.edutech.medicalequipmentandtrackingsystem.repository.EquipmentRepository;
import com.edutech.medicalequipmentandtrackingsystem.repository.OrderRepository;

import javax.persistence.EntityNotFoundException;

import java.io.ObjectInputFilter.Status;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {
    
//Implement the required code here
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private EquipmentRepository equipmentRepository;
  
    public Order placeOrder(Long equipmentId, Order order) {
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        order.setEquipment(equipment);
        if(order.getStatus()==null||order.getStatus().isEmpty()){
            order.setStatus("Initiated");
        }
        return orderRepository.save(order);
 }
 public void deleteOrder(Long id) {
    orderRepository.deleteById(id);
}

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
 }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        return orderRepository.save(order);
 }

}
