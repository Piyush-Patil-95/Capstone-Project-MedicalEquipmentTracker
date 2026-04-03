package com.edutech.medicalequipmentandtrackingsystem.jwt;


import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.edutech.medicalequipmentandtrackingsystem.service.UserService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;


    
@Override
protected void doFilterInternal(HttpServletRequest request,
                               HttpServletResponse response,
                               FilterChain chain)
        throws ServletException, IOException {

    String path = request.getServletPath();

    //skipping this
    if (path.equals("/api/user/login") || path.equals("/api/user/register")) {
        chain.doFilter(request, response);
        return;
    }

    final String header = request.getHeader("Authorization");//coming from frontend

    String username = null;
    String token = null;

    if (header != null && header.startsWith("Bearer ")) {
        token = header.substring(7);
        username = jwtUtil.extractUsername(token);
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

        UserDetails userDetails = userService.loadUserByUsername(username);

        if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }

    chain.doFilter(request, response);
}
}

