package com.example.clinic.controller;

import com.example.clinic.dto.AppointmentDto;
import com.example.clinic.dto.DoctorDto;
import com.example.clinic.dto.stdRes;
import com.example.clinic.services.DoctorService;
import com.example.clinic.services.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
public class Admin {
    private final DoctorService doctorService;
    private final PatientService patientService;

    public Admin(DoctorService doctorService, PatientService patientService) {
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    @PostMapping("add-doctor")
    stdRes<DoctorDto> addDoctor(@RequestBody DoctorDto payload) {
        return  doctorService.addNew(payload);
    }
    @GetMapping("get-doctors")
    stdRes<List<DoctorDto>> findAll(){
        return doctorService.findAll();
    }
    @GetMapping("delete-doctors")
    stdRes<List<DoctorDto>> deleteDoctor(@RequestParam Integer id){
        return doctorService.delete(id);
    }
    @GetMapping("get-appointments")
    stdRes<List<AppointmentDto>> getAppointment(){
        return patientService.getAllAppointments();
    }
    @PostMapping("delete-appointment")
    void deleteById(@RequestParam Integer id){
        patientService.delete(id);
    }
}
