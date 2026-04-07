package com.edutech.medicalequipmentandtrackingsystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
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
    private JwtRequestFilter jwtRequestFilter;  // ✅ Only ONE name

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService)
            .passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeRequests()

            // ✅ PUBLIC - No token needed
            .antMatchers(
                "/api/user/register",
                "/api/user/register/**",
                "/api/user/login",
                "/api/user/login/**",
                "/api/captcha/**",
                "/api/contact/**",      // ✅ Contact form - public
                "/api/pdf/**",
                "/api/otp/**", 
                "/",
                "/api/user/dashboard"
            ).permitAll()

            // ✅ ROLE BASED
            .antMatchers("/api/hospital/**")
                .hasAnyAuthority("HOSPITAL", "ADMIN")

            .antMatchers("/api/technician/**")
                .hasAnyAuthority("TECHNICIAN", "HOSPITAL", "ADMIN")

            .antMatchers("/api/supplier/**")
                .hasAnyAuthority("SUPPLIER", "HOSPITAL", "ADMIN")

            // ✅ Everything else needs authentication
            .anyRequest().authenticated()

            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // ✅ Add JWT filter ONCE
        http.addFilterBefore(
            jwtRequestFilter,
            UsernamePasswordAuthenticationFilter.class
        );
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}