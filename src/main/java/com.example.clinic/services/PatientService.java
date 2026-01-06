package com.example.clinic.services;

import com.example.clinic.dto.AppointmentDto;
import com.example.clinic.dto.stdRes;
import com.example.clinic.entities.Appointment;
import com.example.clinic.repo.AppointmentRepository;
import com.example.clinic.repo.DoctorRepo;
import com.example.clinic.repo.UserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepo userRepo;
    private final DoctorRepo doctorRepo;

    public PatientService(AppointmentRepository appointmentRepository, UserRepo userRepo, DoctorRepo doctorRepo) {
        this.appointmentRepository = appointmentRepository;
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
    }
    public stdRes<List<AppointmentDto>> userAppointment(){
        var context = SecurityContextHolder.getContext().getAuthentication();
        var name=context.getName();
        var user=userRepo.findUserByEmail(name);
        return new stdRes<>("", true, appointmentRepository.findAllByUser(user).stream().map(Appointment::from).toList());
    }

    public stdRes<List<AppointmentDto>> addAppointment(AppointmentDto dto) {
        Appointment appointment = new Appointment();
        appointment.setAmpm(dto.ampm());
        appointment.setDate(dto.date());
        appointment.setTime(dto.time());
        appointment.setStatus(dto.status());
        var user = userRepo.findUserById(dto.patientId());
        appointment.setUser(user);
        var doc = doctorRepo.findDoctorById(dto.doctorId());
        appointment.setDoctor(doc);
        appointmentRepository.save(appointment);
        return getAllAppointments();
    }

    public stdRes<List<AppointmentDto>> getAllAppointments() {
        return new stdRes<>("", true, appointmentRepository.findAll().stream().map(Appointment::from).toList());
    }
    public void delete(Integer id){
        appointmentRepository.deleteById(id);
    }
}
