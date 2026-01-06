package com.example.clinic.services;

import com.example.clinic.dto.SignUpForm;
import com.example.clinic.dto.stdRes;
import com.example.clinic.entities.User;
import com.example.clinic.enums.UserRole;
import com.example.clinic.repo.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    PasswordEncoder passwordEncoder ;
    UserRepo repo;
    JwtService jwtService;
    public AuthService(PasswordEncoder passwordEncoder, UserRepo userRepo,JwtService jwtService) {
        this.passwordEncoder = passwordEncoder;
        this.repo = userRepo;
        this.jwtService = jwtService;
    }
   public stdRes<Object> signUp(SignUpForm signUpForm) {
        System.out.println("signUp");
        if(repo.existsUserByEmail(signUpForm.email())){
            return new stdRes<>("User with email already exists");
        }
        User user = new User();
        user.setEmail(signUpForm.email());
        user.setPassword(passwordEncoder.encode(signUpForm.password()));
        user.setFirstName(signUpForm.firstName());
        user.setLastName(signUpForm.lastName());
        user.setRole(UserRole.valueOf(signUpForm.role()));
        repo.save(user);
        return new  stdRes<>("User created");
    }
    public stdRes<SignUpForm> login(String email, String password,String role) {
        if(repo.existsUserByEmail(email)){
            User user = repo.findUserByEmail(email);
            if(!user.getRole().equals(UserRole.valueOf(role))){
                return new stdRes<>("Invalid role",false);
            }
            if(passwordEncoder.matches(password,user.getPassword())){
                var token = jwtService.generate(user.getEmail());
                var res=new SignUpForm(user.getEmail(), user.getFirstName(), user.getLastName(), "",user.getRole().toString(),token, user.getId());
                return new stdRes<>("User successfully logged in",res);
            }else {
                return new stdRes<>("Wrong password",false);
            }
        }else{
            return new stdRes<>("User not found",false);
        }
    }
}
