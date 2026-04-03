package com.edutech.medicalequipmentandtrackingsystem.jwt;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.User;
import com.edutech.medicalequipmentandtrackingsystem.repository.UserRepository;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
@Component
public class JwtUtil {

private String SECRET_KEY= "mysecretkeymysecretkeymysecretkey";

private Key key=Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
 
 
 
public String generateToken(UserDetails userDetails) {
 
    Map<String, Object> claims = new HashMap<>();
 
    claims.put("role", userDetails.getAuthorities());
 
    return Jwts.builder()

            .setClaims(claims)

            .setSubject(userDetails.getUsername())

            .setIssuedAt(new Date())

            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))

            .signWith(key)

            .compact();

}

    public String extractUsername(String token) {

        return extractAllClaims(token).getSubject();

}
 
    public boolean isTokenValid(String token, String username) {

        return extractUsername(token).equals(username);

}
 
    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody();

}

}
 