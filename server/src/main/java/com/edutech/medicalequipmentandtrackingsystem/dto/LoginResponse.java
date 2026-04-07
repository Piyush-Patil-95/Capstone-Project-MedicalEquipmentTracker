package com.edutech.medicalequipmentandtrackingsystem.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {
   private String token;
    private String username;
    private String email;
    private String role;
   
@JsonCreator
 public LoginResponse(
@JsonProperty("token") String token,
@JsonProperty("username") String username,
@JsonProperty("email") String email,
@JsonProperty("role") String role)

 {
   this.token=token;
   this.username=username;
   this.email=email;
   this.role=role;
 }

public String getToken() {
   return token;
}

public String getUsername() {
   return username;
}

public String getEmail() {
   return email;
}

public String getRole() {
   return role;
}

 

 
}
