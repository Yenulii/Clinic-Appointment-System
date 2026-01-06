package com.example.clinic.configs;

import com.example.clinic.entities.User;
import com.example.clinic.enums.UserRole;
import com.example.clinic.repo.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner init(UserRepo userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsUserByEmail("admin@test.com")) {
                var admin = new User();
                admin.setEmail("admin@test.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(UserRole.admin);
                admin.setFirstName("admin");
                admin.setLastName("admin");
                userRepository.save(admin);
                System.out.println("Admin user created!");
            }
            if (!userRepository.existsUserByEmail("user@test.com")) {
                var admin = new User();
                admin.setEmail("user@test.com");
                admin.setPassword(passwordEncoder.encode("user123"));
                admin.setRole(UserRole.patient);
                admin.setFirstName("user");
                admin.setLastName("user");
                userRepository.save(admin);
                System.out.println("user created!");
            }
        };
    }
}