package com.eugene.qp.service.impl;

import com.eugene.qp.repository.dao.UserRepository;
import com.eugene.qp.repository.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.springframework.security.core.userdetails.User.builder;

public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByEmail(username);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("Specified email does not exist");
        }
        User user = userOptional.get();

        // for now app has only one role
        String[] roles = { "USER" };
        return builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(roles)
                .build();
    }
}
