package com.example.clinic.dto;

import com.example.clinic.enums.Genders;

public record DoctorDto(
        Double fee,
        String firstName,
        String lastName,
        Genders gender,
        String phone,
        String qualification,
        String specialization,
        Integer id,
        String email
) {
}
