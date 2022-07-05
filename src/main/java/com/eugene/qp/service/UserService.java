package com.eugene.qp.service;

import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.dto.UserCredentials;

import java.util.Optional;

public interface UserService {

    Optional<User> logIn(UserCredentials uc);
}
