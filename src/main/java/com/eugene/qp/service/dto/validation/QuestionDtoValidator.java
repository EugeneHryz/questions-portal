package com.eugene.qp.service.dto.validation;

import com.eugene.qp.repository.entity.AnswerType;
import com.eugene.qp.service.dto.QuestionDto;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import java.util.Arrays;
import java.util.Set;

import static com.eugene.qp.repository.entity.AnswerType.*;

public class QuestionDtoValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return QuestionDto.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        QuestionDto questionDto = (QuestionDto) target;

        ValidationUtils.rejectIfEmpty(errors, "question", "error.question.empty");
        ValidationUtils.rejectIfEmpty(errors, "toUserEmail", "error.toUserEmail.empty");

        AnswerType answerType = questionDto.getAnswerType();
        if (answerType == null) {
            errors.rejectValue("answerType", "error.answerType.null");
        }
        Set<String> answerOptions = questionDto.getAnswerOptions();
        if (answerOptions == null) {
            errors.reject("answerOptions", "error.answerOptions.null");
        } else {
            if (!Arrays.asList(SINGLE_LINE_TEXT, MULTILINE_TEXT, DATE).contains(answerType)) {
                if (answerType == CHECKBOX && answerOptions.size() != 1) {
                    errors.rejectValue("answerOptions", "error.answerOptions.checkboxInvalidOptionNumber");
                } else if (answerOptions.size() == 0) {
                    errors.rejectValue("answerOptions", "error.answerOptions.invalidOptionNumber");
                }
            }
        }
    }
}
