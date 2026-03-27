package com.edutech.medicalequipmentandtrackingsystem.entitiy;


import javax.persistence.*;
import java.util.Date;

@Table(name = "orders") // do not change table name
public class Order {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private  Date OrderDate;
    private Status status;
    private enum Status{
        Pending,
        Shipped,
        Delivered

    }
    private int quantity;
    @ManyToOne
    @JoinColumn(name="equipment_id")
    private  Equipment equipment;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Date getOrderDate() {
        return OrderDate;
    }
    public void setOrderDate(Date orderDate) {
        OrderDate = orderDate;
    }
    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public Equipment getEquipment() {
        return equipment;
    }
    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }


    
}
