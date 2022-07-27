package com.eugene.qp.service.dto.converter;

import com.eugene.qp.repository.entity.AnswerOption;
import com.eugene.qp.repository.entity.Question;
import com.eugene.qp.service.dto.QuestionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class QuestionConverter implements Converter<Question, QuestionDto> {

    private final UserConverter userConverter;

    @Autowired
    public QuestionConverter(UserConverter userConverter) {
        this.userConverter = userConverter;
    }

    @Override
    public QuestionDto convert(Question source) {
        QuestionDto questionDto = new QuestionDto(source.getQuestion(),
                source.getAnswerType(),
                userConverter.convert(source.getFromUser()),
                source.getToUser().getEmail(),
                source.getAnswerOptions().stream()
                        .map(AnswerOption::getOption)
                        .collect(Collectors.toSet()));
        questionDto.setId(source.getId());
        return questionDto;
    }
}
