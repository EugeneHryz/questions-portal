package com.eugene.qp.service;

import com.eugene.qp.service.dto.AnswerDto;
import com.eugene.qp.service.exception.AnswerNotFoundException;
import com.eugene.qp.service.exception.QuestionNotFoundException;

import java.util.Set;

public interface AnswerService {

    AnswerDto createAnswer(AnswerDto answerDto) throws QuestionNotFoundException;

    AnswerDto updateAnswer(AnswerDto answerDto) throws AnswerNotFoundException;

    Set<AnswerDto> getAnswersByQuestionIds(Long[] ids);
}
