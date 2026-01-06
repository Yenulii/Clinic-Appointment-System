package com.example.clinic.dto;


public record AppointmentDto(
        Float id,
        Integer doctorId,
        String doctorName,
        String specialization,
        String date,
        String time,
        String ampm,
        String status,
        String patientName,
        Integer patientId
) {
}
