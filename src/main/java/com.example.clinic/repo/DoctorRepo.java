package com.example.clinic.repo;

import com.example.clinic.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepo extends JpaRepository<Doctor, Integer> {
    void deleteDoctorById(Integer id);
    Doctor findDoctorById(Integer id);
}
