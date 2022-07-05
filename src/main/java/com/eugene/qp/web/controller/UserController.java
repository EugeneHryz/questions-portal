package com.eugene.qp.web.controller;

import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.UserService;
import com.eugene.qp.service.dto.UserCredentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(value = "/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/login")
    public ResponseEntity<?> logIn(@RequestBody UserCredentials uc) {
        Optional<User> user = userService.logIn(uc);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }
}
