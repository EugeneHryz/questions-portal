package com.eugene.qp.service.dto.converter;

import com.eugene.qp.repository.entity.User;
import com.eugene.qp.service.dto.UserDto;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;

@Component
public class UserConverter implements Converter<User, UserDto> {

    @Override
    public UserDto convert(User source) {
        UserDto userDto = new UserDto();
        try {
            BeanUtils.copyProperties(userDto, source);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException("Unable to convert from User to UserDto");
        }
        return userDto;
    }
}
