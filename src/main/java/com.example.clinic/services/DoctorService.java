package com.example.clinic.services;

import com.example.clinic.dto.*;
import com.example.clinic.entities.Doctor;
import com.example.clinic.enums.UserRole;
import com.example.clinic.repo.AppointmentRepository;
import com.example.clinic.repo.DoctorRepo;
import com.example.clinic.repo.UserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {


    private final DoctorRepo doctorRepo;
    private final UserRepo userRepo;
    private final AppointmentRepository appointmentRepository;

    DoctorService(DoctorRepo doctorRepo, UserRepo userRepo, AppointmentRepository appointmentRepository) {
        this.doctorRepo = doctorRepo;
        this.userRepo = userRepo;
        this.appointmentRepository = appointmentRepository;
    }

    public stdRes<DoctorDto> addNew(DoctorDto dto){
        chackAdmin();
        var doc = Doctor.from(dto);
        doctorRepo.save(doc);
        return new stdRes<>("Doctor has been saved successfully",Doctor.from(doc));
    }
    public stdRes<List<DoctorDto>> findAll(){
        var doctors = doctorRepo.findAll().stream().map(Doctor::from).toList();
        return new stdRes<>("done",doctors);
    }
    public stdRes<List<DoctorDto>> delete(Integer id){
        chackAdmin();
        if(appointmentRepository.existsAppointmentsByDoctor_Id(id)){
            return findAll();
        }
        doctorRepo.deleteById(id);
        return findAll();
    }
    void chackAdmin(){
        var context = SecurityContextHolder.getContext().getAuthentication();
        var name=context.getName();
        var user=userRepo.findUserByEmail(name);
        if(!user.getRole().equals(UserRole.admin)){
            throw new RuntimeException();
        }
    }
}
