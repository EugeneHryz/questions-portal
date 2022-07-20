package com.eugene.qp.service.dto.converter;

import com.eugene.qp.repository.entity.AnswerOption;
import com.eugene.qp.repository.entity.Question;
import com.eugene.qp.service.dto.QuestionDto;

import java.util.stream.Collectors;

public class QuestionDtoConverter extends AbstractTwoWayConverter<Question, QuestionDto> {

    private final AnswerTypeDtoConverter answerTypeConverter;

    public QuestionDtoConverter(AnswerTypeDtoConverter answerTypeConverter) {
        this.answerTypeConverter = answerTypeConverter;
    }

    @Override
    protected QuestionDto convertTo(Question source) {
        QuestionDto questionDto = new QuestionDto(source.getQuestion(),
                answerTypeConverter.convertTo(source.getAnswerType()),
                source.getFromUser().getId(),
                source.getToUser().getEmail(),
                source.getAnswerOptions().stream().map(AnswerOption::getOption).collect(Collectors.toSet()));
        questionDto.setId(source.getId());
        return questionDto;
    }

    @Override
    protected Question convertBack(QuestionDto source) {
        Question question = new Question(source.getQuestion(),
                answerTypeConverter.convertBack(source.getAnswerType()),
                null, null,
                source.getAnswerOptions().stream().map(AnswerOption::new).collect(Collectors.toSet()));
        question.setId(source.getId());
        return question;
    }
}
