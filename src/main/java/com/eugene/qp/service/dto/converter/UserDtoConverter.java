package com.eugene.qp.service.dto.converter;

import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.dto.UserDto;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;

@Component
public class UserDtoConverter implements Converter<UserDto, User> {

    @Override
    public User convert(UserDto source) {
        User user = new User();
        try {
            BeanUtils.copyProperties(user, source);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Unable to convert from UserDto to User");
        }
        return user;
    }
}
