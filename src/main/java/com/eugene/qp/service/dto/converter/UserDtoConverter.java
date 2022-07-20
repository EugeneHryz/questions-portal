package com.eugene.qp.service.dto.converter;

import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.dto.UserDto;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;

public class UserDtoConverter extends AbstractTwoWayConverter<User, UserDto> {

    @Override
    protected UserDto convertTo(User source) {
        UserDto userDto = new UserDto();
        try {
            BeanUtils.copyProperties(userDto, source);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Unable to convert from User to UserDto");
        }
        return userDto;
    }

    @Override
    protected User convertBack(UserDto source) {
        User user = new User();
        try {
            BeanUtils.copyProperties(user, source);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Unable to convert from UserDto to User");
        }
        return user;
    }
}
