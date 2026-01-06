package com.example.clinic.entities;

import com.example.clinic.dto.AppointmentDto;
import jakarta.persistence.*;

@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    private Doctor doctor;
    private String date;
    private String time;
    private String ampm;
    private String status;
    @ManyToOne
    private User user;

    public static AppointmentDto from(Appointment a){
        return new AppointmentDto(
                a.id.floatValue(),
                a.doctor.getId(),
                a.doctor.getFirstName(),
                a.doctor.getSpecialization(),
                a.date,
                a.time,
                a.ampm,
                a.status,
                a.user.getFirstName(),
                a.user.getId()
        );
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getAmpm() {
        return ampm;
    }

    public void setAmpm(String ampm) {
        this.ampm = ampm;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
