package com.eugene.qp.web.controller;

import com.eugene.qp.service.UserService;
import com.eugene.qp.service.dto.UserDto;
import com.eugene.qp.service.dto.validation.UserDtoValidator;
import com.eugene.qp.service.exception.InvalidPasswordException;
import com.eugene.qp.service.exception.UserAlreadyExistsException;
import com.eugene.qp.service.exception.UserNotFoundException;
import com.eugene.qp.web.exception.InvalidRequestException;
import com.eugene.qp.web.exception.UnauthorizedAccessException;
import com.eugene.qp.web.model.UserPasswordModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;

@RestController
@RequestMapping(value = "/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @InitBinder(value = "userDto")
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(new UserDtoValidator());
    }

    @GetMapping(value = "/login")
    public UserDto logIn(Principal user) throws UserNotFoundException {
        return userService.getUserByEmail(user.getName());
    }

    @GetMapping
    public Page<UserDto> searchUsersByEmail(@RequestParam(value = "email", defaultValue = "") String email,
                                            @RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "size", defaultValue = "5") int size) {
        return userService.searchUsersByEmailPaginated(email, page, size);
    }

    @PostMapping(value = "/signup")
    public ResponseEntity<UserDto> createUser(@RequestBody @Valid UserDto userDto,
                                              BindingResult result, UriComponentsBuilder ucb)
            throws UserAlreadyExistsException, InvalidRequestException {
        if (result.hasErrors()) {
            throw new InvalidRequestException(result.getAllErrors().toString());
        }
        UserDto createdUser = userService.registerUser(userDto);
        URI locationUri = ucb.path("/users/")
                        .path(String.valueOf(createdUser.getId()))
                        .build()
                        .toUri();
        return ResponseEntity.created(locationUri).body(createdUser);
    }

    @PutMapping(value = "/{id}")
    public UserDto updateUser(@PathVariable long id, @RequestBody @Valid UserDto user,
                              BindingResult result)
            throws UserNotFoundException, InvalidPasswordException,
            InvalidRequestException, UserAlreadyExistsException {

        if (result.hasErrors()) {
            throw new InvalidRequestException(result.getAllErrors().toString());
        }
        user.setId(id);
        return userService.updateUser(user);
    }

    @DeleteMapping(value = "/{id}")
    public void deleteUser(@PathVariable long id, @RequestBody UserPasswordModel password,
                           HttpServletRequest request)
            throws UserNotFoundException, InvalidPasswordException {

        userService.deleteUser(id, password.getPassword(), request);
    }
}
