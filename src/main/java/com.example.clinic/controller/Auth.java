package com.example.clinic.controller;

import com.example.clinic.dto.SignUpForm;
import com.example.clinic.dto.stdRes;
import com.example.clinic.services.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
class Auth {

    private final AuthService authService;

    Auth(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("signup")
    stdRes<Object> signup(@RequestBody SignUpForm signUpForm) {
        return authService.signUp(signUpForm);
    }

    @PostMapping("login")
    stdRes<SignUpForm> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        String role = payload.get("role");
        return authService.login(email, password,role);
    }
}
