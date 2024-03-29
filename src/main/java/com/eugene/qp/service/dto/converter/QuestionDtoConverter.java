package com.eugene.qp.service.dto.converter;

import com.eugene.qp.repository.entity.AnswerOption;
import com.eugene.qp.repository.entity.Question;
import com.eugene.qp.service.dto.QuestionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class QuestionDtoConverter implements Converter<QuestionDto, Question> {

    private final UserDtoConverter userDtoConverter;

    @Autowired
    public QuestionDtoConverter(UserDtoConverter userDtoConverter) {
        this.userDtoConverter = userDtoConverter;
    }

    @Override
    public Question convert(QuestionDto source) {
        Question question = new Question(source.getQuestion(),
                source.getAnswerType(),
                userDtoConverter.convert(source.getFromUser()),
                null,
                source.getAnswerOptions().stream()
                        .map(AnswerOption::new)
                        .collect(Collectors.toSet()));
        question.setId(source.getId());
        return question;
    }
}
