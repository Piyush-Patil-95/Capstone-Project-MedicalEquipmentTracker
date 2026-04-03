package com.edutech.medicalequipmentandtrackingsystem.entitiy;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;

@Entity
@Table(name = "equipments") // do not change table name
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // ✅ NEW: Link equipment to a specific supplier (User with role=SUPPLIER)
    private Long supplierId;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    @JsonIgnoreProperties({"equipmentList"})
    private Hospital hospital;

    public Equipment() {}

    public Equipment(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }

    // ✅ NEW getter/setter
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
}