package com.example.clinic.repo;

import com.example.clinic.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    boolean existsUserByEmail(String email);
    User findUserByEmail(String email);
    User findUserById(int id);
}
