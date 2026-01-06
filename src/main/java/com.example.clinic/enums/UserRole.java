package com.example.clinic.enums;

public enum UserRole {
    patient("patient"), admin("admin");

    private final String name;
    UserRole(String id) {
        this.name = id;
    }
    public String getName() {return name;}

    @Override
    public String toString() {
        return name;
    }

}
