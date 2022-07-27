package com.eugene.qp.service.exception;

public class AnswerNotFoundException extends ServiceException {

    public AnswerNotFoundException() {
        super();
    }

    public AnswerNotFoundException(String message) {
        super(message);
    }

    public AnswerNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public AnswerNotFoundException(Throwable cause) {
        super(cause);
    }
}
