package com.eugene.qp.service.impl;

import com.eugene.qp.repository.dao.UserRepository;
import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.UserService;
import com.eugene.qp.service.dto.UserCredentials;
import com.eugene.qp.service.exception.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<User> logIn(UserCredentials uc) {
        Optional<User> userOptional = userRepository.findByEmail(uc.getEmail());

        Optional<User> result = Optional.empty();
        if (userOptional.isPresent()) {

            // todo: password should be hashed with salt
            User user = userOptional.get();
            byte[] inputPassword = uc.getPassword().getBytes(StandardCharsets.UTF_8);
            if (Arrays.equals(user.getPassword(), inputPassword)) {
                result = userOptional;
            }
        }
        return result;
    }
}
