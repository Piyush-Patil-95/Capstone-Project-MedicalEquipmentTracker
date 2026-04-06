package com.edutech.medicalequipmentandtrackingsystem.repository;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ Active orders only (deleted = false)
    List<Order> findByDeletedFalse();

    // ✅ Deleted orders only (deleted = true)
    List<Order> findByDeletedTrue();
}