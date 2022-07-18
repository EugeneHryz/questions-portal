package com.eugene.qp.web.controller;

import com.eugene.qp.service.UserService;
import com.eugene.qp.service.dto.UserDto;
import com.eugene.qp.service.dto.validation.UserDtoValidator;
import com.eugene.qp.service.exception.InvalidPasswordException;
import com.eugene.qp.service.exception.UserAlreadyExistsException;
import com.eugene.qp.service.exception.UserNotFoundException;
import com.eugene.qp.web.exception.InvalidRequestException;
import com.eugene.qp.web.model.UserPasswordModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping(value = "/users")
public class UserController {

    private final UserService userService;

    @InitBinder(value = "userDto")
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(new UserDtoValidator());
    }

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserDto logIn(Principal user) throws UserNotFoundException {
        return userService.getUserByEmail(user.getName());
    }

    @PostMapping(value = "/signup")
    public UserDto createUser(@RequestBody @Valid UserDto userDto, BindingResult result)
            throws UserAlreadyExistsException, InvalidRequestException {

        if (result.hasErrors()) {
            throw new InvalidRequestException(result.getAllErrors().toString());
        }
        return userService.registerUser(userDto);
    }

    @PutMapping(value = "/{id}")
    public UserDto updateUser(@PathVariable long id, @RequestBody @Valid UserDto user, BindingResult result)
            throws UserNotFoundException, InvalidPasswordException, InvalidRequestException {

        if (result.hasErrors()) {
            throw new InvalidRequestException(result.getAllErrors().toString());
        }
        user.setId(id);
        return userService.updateUser(user);
    }

    @DeleteMapping(value = "/{id}")
    public void deleteUser(@PathVariable long id, @RequestBody UserPasswordModel password,
                           HttpServletRequest request) throws UserNotFoundException, InvalidPasswordException {
        userService.deleteUser(id, password.getPassword(), request);
    }
}
