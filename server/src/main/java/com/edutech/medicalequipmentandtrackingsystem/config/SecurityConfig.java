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
import com.edutech.medicalequipmentandtrackingsystem.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
  private UserService userService; 
  @Autowired
  private JwtRequestFilter jwtRequestFilter;
  @Autowired
  private PasswordEncoder passwordEncoder;
 
   @Override
   protected void configure(AuthenticationManagerBuilder auth)throws Exception{
    auth.userDetailsService(userService).passwordEncoder(passwordEncoder);//password match krta hai db se hashing wala
   }
   @Override
   protected void configure(HttpSecurity http) throws Exception {
      
       http
           .csrf().disable()
           .cors().and()
           .sessionManagement()
           .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
           .and()
           .authorizeRequests()

           .antMatchers("/api/user/register/**","/api/user/login/**").permitAll() //public api
           .antMatchers("/api/hospital/**").hasAuthority("HOSPITAL")
           .antMatchers("/api/technician/**").hasAuthority("TECHNICIAN")
           .antMatchers("/api/supplier/**").hasAuthority("SUPPLIER")

           .anyRequest().authenticated();

           http.addFilterBefore(jwtRequestFilter,UsernamePasswordAuthenticationFilter.class);
           
        
       
      
   }
   @Bean
   @Override
   public AuthenticationManager authenticationManagerBean()throws Exception{
            return super.authenticationManagerBean();
         }



 }
