package com.example.clinic.repo;

import com.example.clinic.entities.Appointment;
import com.example.clinic.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findAllByUser(User user);
    void deleteAppointmentById(Integer id);
    boolean existsAppointmentsByDoctor_Id(Integer doctor);
}
