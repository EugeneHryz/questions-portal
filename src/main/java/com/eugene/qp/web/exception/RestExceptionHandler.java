package com.eugene.qp.web.exception;

import com.eugene.qp.service.exception.InvalidPasswordException;
import com.eugene.qp.service.exception.QuestionNotFoundException;
import com.eugene.qp.service.exception.UserAlreadyExistsException;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler({UserAlreadyExistsException.class,
            UserNotFoundException.class,
            InvalidPasswordException.class,
            InvalidRequestException.class,
            QuestionNotFoundException.class})
    public ResponseEntity<?> controllerException(Exception e) {

        HttpStatus status;
        if (e instanceof UserNotFoundException) {
            status = HttpStatus.NOT_FOUND;
        } else if (e instanceof InvalidRequestException) {
            status = HttpStatus.BAD_REQUEST;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(e.getMessage(), status);
    }
}
