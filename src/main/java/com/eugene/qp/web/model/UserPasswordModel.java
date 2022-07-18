package com.eugene.qp.web.model;

public class UserPasswordModel {

    private String password;

    public UserPasswordModel() {
    }

    public UserPasswordModel(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
