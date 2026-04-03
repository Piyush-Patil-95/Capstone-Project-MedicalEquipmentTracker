package com.edutech.medicalequipmentandtrackingsystem.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Hospital;
import com.edutech.medicalequipmentandtrackingsystem.repository.HospitalRepository;

@Service
public class HospitalService {
    @Autowired
    private HospitalRepository hospitalRepository;
    public List<Hospital> getAllHospitals(){
        return hospitalRepository.findAll();
    }
    public Hospital createHospital(Hospital hospital){
        return hospitalRepository.save(hospital);
    }
    
public void deleteHospital(Long id){
    hospitalRepository.deleteById(id);
}

    //Implement the required code here
}
