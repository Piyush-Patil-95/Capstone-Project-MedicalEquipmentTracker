package com.edutech.medicalequipmentandtrackingsystem.repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ Get orders based on supplierId via equipment
    List<Order> findByEquipment_SupplierId(Long supplierId);
}