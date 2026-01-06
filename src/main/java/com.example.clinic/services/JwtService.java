package com.example.clinic.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtService {
    private final Key key = Keys.hmacShaKeyFor(
            "nvdf-vfhs-nhhj-sfhf-jhdd-czgb-rhsa-kgvz-twvh-brha-ebdj".getBytes()
    );

    public String generate(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 3600_000)
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateAndExtract(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
