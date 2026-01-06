package com.example.clinic.entities;

import com.example.clinic.dto.DoctorDto;
import com.example.clinic.enums.Genders;
import jakarta.persistence.*;

@Entity
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String phone;
    private String qualification;
    private String specialization;
    private Genders gender;
    private Double fee;
    @Column(unique = true)
    private String email;

    public static DoctorDto from(Doctor doc) {
        return new DoctorDto(doc.fee, doc.firstName, doc.lastName, doc.getGender(), doc.phone, doc.qualification, doc.specialization, doc.id,doc.email);
    }

    public static Doctor from(DoctorDto dto) {
        var doc = new Doctor();
        doc.fee = dto.fee();
        doc.firstName = dto.firstName();
        doc.lastName = dto.lastName();
        doc.phone = dto.phone();
        doc.qualification = dto.qualification();
        doc.specialization = dto.specialization();
        doc.gender = dto.gender();
        doc.email=dto.email();
        return doc;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Genders getGender() {
        return gender;
    }

    public void setGender(Genders gender) {
        this.gender = gender;
    }

    public Double getFee() {
        return fee;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }
}
