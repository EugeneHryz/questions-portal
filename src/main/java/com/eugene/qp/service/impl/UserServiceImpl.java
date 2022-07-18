package com.eugene.qp.service.impl;

import com.eugene.qp.repository.dao.UserRepository;
import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.MailService;
import com.eugene.qp.service.UserService;
import com.eugene.qp.service.dto.UserDto;
import com.eugene.qp.service.exception.InvalidPasswordException;
import com.eugene.qp.service.exception.UserAlreadyExistsException;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
@PropertySource("classpath:message.properties")
public class UserServiceImpl implements UserService {

    private static final String emailFrom = "dev.mail187@gmail.com";

    private final UserRepository userRepository;
    private final PasswordEncoder pwEncoder;

    private final ConversionService conversionService;

    private final MailService mailService;
    private final LogoutHandler logoutHandler;

    @Autowired
    private Environment env;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           ConversionService conversionService,
                           PasswordEncoder pwEncoder,
                           MailService mailService,
                           LogoutHandler logoutHandler) {
        this.userRepository = userRepository;
        this.conversionService = conversionService;
        this.pwEncoder = pwEncoder;
        this.mailService = mailService;
        this.logoutHandler = logoutHandler;
    }

    @Override
    public UserDto registerUser(UserDto user) throws UserAlreadyExistsException {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("User with specified email already exists");
        }
        String pwEncoded = pwEncoder.encode(user.getPassword());
        byte[] pwEncodedBytes = pwEncoded.getBytes(StandardCharsets.UTF_8);

        User newUser = new User(user.getEmail(),
                pwEncodedBytes,
                user.getPhoneNumber(),
                user.getFirstName(),
                user.getLastName());
        User savedUser = userRepository.save(newUser);
        user.setPassword(null);
        user.setId(savedUser.getId());

        mailService.sendSimpleMail(emailFrom, user.getEmail(),
                env.getProperty("mail.accountCreated.subject"),
                env.getProperty("mail.accountCreated.text"));

        return user;
    }

    @Override
    public UserDto getUserByEmail(String email) throws UserNotFoundException {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("User with specified email does not exist");
        }
        User user = userOptional.get();
        UserDto userDto = conversionService.convert(user, UserDto.class);
        if (userDto != null) {
            userDto.setPassword(null);
        }
        return userDto;
    }

    @Override
    public UserDto updateUser(UserDto user) throws UserNotFoundException, InvalidPasswordException {
        Optional<User> userOptional = userRepository.findById(user.getId());
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("Unable to find user with id = " + user.getId());
        }
        User oldUser = userOptional.get();
        String currentPw = new String(oldUser.getPassword(), StandardCharsets.UTF_8);
        if (!pwEncoder.matches(user.getPassword(), currentPw)) {
            throw new InvalidPasswordException("Invalid password");
        }
        String newPwEncoded = pwEncoder.encode(user.getPassword());
        byte[] newPwEncodedBytes = newPwEncoded.getBytes(StandardCharsets.UTF_8);

        oldUser.setPassword(newPwEncodedBytes);
        oldUser.setFirstName(user.getFirstName());
        oldUser.setLastName(user.getLastName());
        oldUser.setPhoneNumber(user.getPhoneNumber());
        if (!oldUser.getEmail().equals(user.getEmail())) {

            oldUser.setEmail(user.getEmail());
            mailService.sendSimpleMail(emailFrom, user.getEmail(),
                    env.getProperty("mail.emailUpdated.subject"),
                    env.getProperty("mail.emailUpdated.text"));
        }
        User updatedUser = userRepository.save(oldUser);
        return conversionService.convert(updatedUser, UserDto.class);
    }

    @Override
    public void deleteUser(long id, String password, HttpServletRequest request) throws UserNotFoundException, InvalidPasswordException {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new UserNotFoundException("Unable to find user with id = " + id);
        }
        User user = userOptional.get();
        String currentPassword = new String(user.getPassword(), StandardCharsets.UTF_8);
        if (!pwEncoder.matches(password, currentPassword)) {
            throw new InvalidPasswordException("Invalid password");
        }

        logoutHandler.logout(request, null, null);
        userRepository.delete(user);
        mailService.sendSimpleMail(emailFrom, user.getEmail(),
                env.getProperty("mail.accountDeleted.subject"),
                env.getProperty("mail.accountDeleted.text"));
    }
}
