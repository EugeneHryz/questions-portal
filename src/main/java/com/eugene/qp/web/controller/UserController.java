package com.eugene.qp.web.controller;

import com.eugene.qp.service.UserService;
import com.eugene.qp.service.dto.UserDto;
import com.eugene.qp.service.exception.InvalidPasswordException;
import com.eugene.qp.service.exception.UserAlreadyExistsException;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping(value = "/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserDto logIn(Principal user) throws UserNotFoundException {
        return userService.getUserByEmail(user.getName());
    }

    @PostMapping(value = "/signup")
    public UserDto register(@RequestBody UserDto userDto) throws UserAlreadyExistsException {
        return userService.registerUser(userDto);
    }

    @PutMapping(value = "/{id}")
    public UserDto updateUser(@PathVariable long id, @RequestBody UserDto user) throws UserNotFoundException,
            InvalidPasswordException {
        user.setId(id);
        return userService.updateUser(user);
    }
}
