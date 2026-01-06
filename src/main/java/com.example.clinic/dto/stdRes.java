package com.example.clinic.dto;

public class stdRes<T> {
    private final String message;
    private Boolean success=true;
    private T data=null;

    public stdRes(String message) {
        this(message,true,null);
    }
    public stdRes(String message, Boolean success) {
        this(message,success,null);
    }
    public stdRes(String message, T data) {
        this(message,true,data);
    }
    public stdRes(String message, Boolean success, T data) {
        this.message=message;
        this.success=success;
        this.data=data;
    }

    public String getMessage() {
        return message;
    }

    public Boolean getSuccess() {
        return success;
    }

    public T getData() {
        return data;
    }
}
