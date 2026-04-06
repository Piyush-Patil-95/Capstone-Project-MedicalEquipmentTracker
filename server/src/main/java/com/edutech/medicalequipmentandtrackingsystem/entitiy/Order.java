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

    @Temporal(TemporalType.TIMESTAMP) // ✅ ADDED
    private Date OrderDate;

    private String status;

    private boolean paymentDone = false;

    private int quantity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipment_id")
    @JsonIgnoreProperties({"hospital"})
    private Equipment equipment;

    // ============================
    // ✅ ADDED FROM NEW CODE
    // ============================

    @Column(nullable = false)
    private boolean deleted = false;

    @Temporal(TemporalType.TIMESTAMP)
    private Date deletedAt;

    @Column(nullable = false)
    private String paymentStatus = "Unpaid";

    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentUpdatedAt;

    // ============================
    // GETTERS / SETTERS
    // ============================

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

    public boolean isPaymentDone() {
        return paymentDone;
    }

    public void setPaymentDone(boolean paymentDone) {
        this.paymentDone = paymentDone;
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

    // ============================
    // ✅ NEW GETTERS/SETTERS
    // ============================

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Date getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Date deletedAt) {
        this.deletedAt = deletedAt;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Date getPaymentUpdatedAt() {
        return paymentUpdatedAt;
    }

    public void setPaymentUpdatedAt(Date paymentUpdatedAt) {
        this.paymentUpdatedAt = paymentUpdatedAt;
    }
}