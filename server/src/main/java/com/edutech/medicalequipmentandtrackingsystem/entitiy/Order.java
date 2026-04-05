package com.edutech.medicalequipmentandtrackingsystem.entitiy;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.Date;
@Entity
@Table(name = "orders") // do not change table name
public class Order {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private  Date OrderDate;
    private String status;
    private boolean paymentDone = false;
    // private enum Status{
    //     Pending,
    //     Shipped,
    //     Delivered

    // }
    private int quantity;
    @ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "equipment_id")
@JsonIgnoreProperties({"hospital"})  // 🔥 IMPORTANT
private Equipment equipment;
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
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
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
    public boolean isPaymentDone() {
    return paymentDone;
}

public void setPaymentDone(boolean paymentDone) {
    this.paymentDone = paymentDone;
}


    
}
