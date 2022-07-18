package com.eugene.qp.service.dto.validation;

import com.eugene.qp.service.dto.UserDto;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

public class UserDtoValidator implements Validator {

    private static final String NAME_REGEX = "^(\\p{L}){3,25}$";
    private static final String PHONE_NUMBER_REGEX = "^\\+[0-9]{12}$";
    private static final String EMAIL_REGEX = "^(?=.{3,30}$)[\\w.]+@[\\w.]+$";

    private static final String CONTAINS_DIGIT_REGEX = "^.*[0-9].*$";
    private static final String CONTAINS_LOWERCASE_CHAR_REGEX = "^.*[a-z].*$";
    private static final String CONTAINS_UPPERCASE_CHAR_REGEX = "^.*[A-Z].*$";

    @Override
    public boolean supports(Class<?> clazz) {
        return UserDto.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        UserDto userDto = (UserDto) target;

        String firstName = userDto.getFirstName();
        if (firstName.length() > 0 && !firstName.matches(NAME_REGEX)) {
            errors.rejectValue("firstName", "First name must be between 3 and 25 characters in length " +
                    "and cannot contain digits or special characters");
        }

        String lastName = userDto.getLastName();
        if (lastName.length() > 0 && !lastName.matches(NAME_REGEX)) {
            errors.rejectValue("lastName", "Last name must be between 3 and 25 characters in length " +
                    "and cannot contain digits or special characters");
        }

        String phoneNumber = userDto.getPhoneNumber();
        if (phoneNumber.length() > 0 && !phoneNumber.matches(PHONE_NUMBER_REGEX)) {
            errors.rejectValue("phoneNumber", "Phone number must be in international format");
        }

        String email = userDto.getEmail();
        if (email.length() == 0) {
            errors.rejectValue("email", "email is required");
        } else if (!email.matches(EMAIL_REGEX)) {
            errors.rejectValue("email", "Invalid email format");
        }

        String password = userDto.getPassword();
        if (password.length() < 8 || password.length() > 30) {
            errors.rejectValue("password", "Password length must be between 8 and 30 characters");
        } else if (!password.matches(CONTAINS_DIGIT_REGEX) || !password.matches(CONTAINS_LOWERCASE_CHAR_REGEX)
                || !password.matches(CONTAINS_UPPERCASE_CHAR_REGEX)) {

            errors.rejectValue("password", "Password must contain at least one lowercase, " +
                    "one uppercase character and one digit");
        }
    }
}
