package com.eugene.qp.service;

import com.eugene.qp.service.dto.AnswerTypeDto;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QuestionService {

    List<AnswerTypeDto> getAllAnswerTypes();

    QuestionDto createQuestion(QuestionDto question) throws UserNotFoundException;

    Page<QuestionDto> getUserQuestionsPaginated(long userId, int page, int size);
}
