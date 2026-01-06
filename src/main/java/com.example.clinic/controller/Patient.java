package com.example.clinic.controller;

import com.example.clinic.dto.AppointmentDto;
import com.example.clinic.dto.stdRes;
import com.example.clinic.services.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/patient")
public class Patient {
    private final PatientService patientService;

    public Patient(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("new-appointment")
    stdRes<List<AppointmentDto>> newAppointment(@RequestBody AppointmentDto appointmentDto){
        System.out.println("appointmentDto:"+appointmentDto);
        return patientService.addAppointment(appointmentDto);
    }

    @GetMapping("get-appointment")
    stdRes<List<AppointmentDto>> UserAppointment(){
        return patientService.userAppointment();
    }

    @PostMapping("delete-appointment")
    void deleteById(@RequestParam Integer id){
        patientService.delete(id);
    }

}
