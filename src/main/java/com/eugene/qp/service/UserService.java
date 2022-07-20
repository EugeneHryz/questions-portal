package com.eugene.qp.service;

import com.eugene.qp.service.dto.UserDto;
import com.eugene.qp.service.exception.InvalidPasswordException;
import com.eugene.qp.service.exception.UserAlreadyExistsException;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.data.domain.Page;

import javax.servlet.http.HttpServletRequest;

public interface UserService {

    UserDto registerUser(UserDto user) throws UserAlreadyExistsException;

    UserDto getUserByEmail(String email) throws UserNotFoundException;

    Page<UserDto> searchUsersByEmailPaginated(String searchEmail, int page, int size);

    UserDto updateUser(UserDto user) throws UserNotFoundException, InvalidPasswordException;

    /**
     * This method deletes the user with given id if the password is correct.
     * Before the deletion the user is logged out
     *
     * @param id user id
     * @param password user password
     * @param request request for invalidating user session
     * @throws UserNotFoundException if user with the given id cannot be found
     * @throws InvalidPasswordException if password doesn't match stored password
     */
    void deleteUser(long id, String password, HttpServletRequest request) throws UserNotFoundException,
            InvalidPasswordException;
}
