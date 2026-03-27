package com.edutech.medicalequipmentandtrackingsystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.edutech.medicalequipmentandtrackingsystem.jwt.JwtRequestFilter;


public class SecurityConfig {
    private final UserDetailsService userDetailsService;
private final JwtRequestFilter jwtRequestFilter;
private final PasswordEncoder passwordEncoder;
public SecurityConfig(UserDetailsService userDetailsService, JwtRequestFilter jwtRequestFilter,
        PasswordEncoder passwordEncoder) {
    this.userDetailsService = userDetailsService;
    this.jwtRequestFilter = jwtRequestFilter;
    this.passwordEncoder = passwordEncoder;
}
protected void configure(AuthenticationManagerBuilder auth) throws Exception{
    auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
}
protected void configure(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .authorizeRequests()
        // POST endpoints
        .antMatchers(HttpMethod.POST, "/api/user/register", "/api/user/login").permitAll()
        .antMatchers(HttpMethod.POST, "/api/hospital/create", "/api/hospital/equipment", 
                     "/api/hospital/maintenance/schedule", "/api/hospital/order").hasAuthority("HOSPITAL")
        
        // GET endpoints
        .antMatchers(HttpMethod.GET, "/api/hospitals", "/api/hospital/equipment/{hospitalId}").hasAuthority("HOSPITAL")
        .antMatchers(HttpMethod.GET, "/api/technician/maintenance", "/api/supplier/orders").hasAuthority("TECHNICIAN")
        
        // PUT endpoints
        .antMatchers(HttpMethod.PUT, "/api/technician/maintenance/update/{maintenanceId}").hasAuthority("TECHNICIAN")
        .antMatchers(HttpMethod.PUT, "/api/supplier/order/update/{orderId}").hasAuthority("SUPPLIER")
        
        .anyRequest().authenticated()
        .and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

    // Add JWT Filter
    http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
}
 public AuthenticationManager authenticationManagerBean() throws Exception{
    return authenticationManagerBean();
 }

}