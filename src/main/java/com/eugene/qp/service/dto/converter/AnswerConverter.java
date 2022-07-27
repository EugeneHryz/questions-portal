package com.eugene.qp.service.dto.converter;

import com.eugene.qp.repository.entity.Answer;
import com.eugene.qp.service.dto.AnswerDto;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class AnswerConverter implements Converter<Answer, AnswerDto> {

    @Override
    public AnswerDto convert(Answer source) {
        AnswerDto answerDto = new AnswerDto(source.getAnswer(),
                source.getQuestion().getId());
        answerDto.setId(source.getId());
        return answerDto;
    }
}
