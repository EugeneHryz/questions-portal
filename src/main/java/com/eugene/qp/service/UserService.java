package com.eugene.qp.service;

import com.eugene.qp.service.dto.UserDto;
import com.eugene.qp.service.exception.InvalidPasswordException;
import com.eugene.qp.service.exception.UserAlreadyExistsException;
import com.eugene.qp.service.exception.UserNotFoundException;

public interface UserService {

    UserDto registerUser(UserDto user) throws UserAlreadyExistsException;

    UserDto getUserByEmail(String email) throws UserNotFoundException;

    UserDto updateUser(UserDto user) throws UserNotFoundException, InvalidPasswordException;
}
