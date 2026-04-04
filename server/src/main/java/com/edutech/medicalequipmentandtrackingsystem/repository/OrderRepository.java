package com.edutech.medicalequipmentandtrackingsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;

import java.util.List;


public interface OrderRepository  extends JpaRepository<Order,Long>{
    List<Order>findByEquipmentId(Long equipmentId);
    // extend jpa repository and add method if needed
    
// ✅ Active orders only
    List<Order> findByDeletedFalse();

    // ✅ Deleted orders only
    List<Order> findByDeletedTrue();

}
