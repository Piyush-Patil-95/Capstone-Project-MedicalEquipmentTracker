package com.edutech.medicalequipmentandtrackingsystem.entitiy;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "hospital")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private boolean paymentDone = false;
    private String username;

    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"hospital"})
    private List<Equipment> equipmentList;

    public Hospital() {}

    public Hospital(String name, String location) {
        this.name = name;
        this.location = location;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public boolean isPaymentDone() { return paymentDone; }
    public void setPaymentDone(boolean paymentDone) { this.paymentDone = paymentDone; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public List<Equipment> getEquipmentList() { return equipmentList; }
    public void setEquipmentList(List<Equipment> equipmentList) { this.equipmentList = equipmentList; }
}