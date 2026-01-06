package com.example.clinic.dto;
public record SignUpForm(
        String email,
        String firstName,
        String lastName,
        String password,
        String role,
        String token,
        Integer id
) {
}
