package com.eugene.qp.service;

import com.eugene.qp.repository.entity.AnswerType;
import com.eugene.qp.service.dto.QuestionDto;
import com.eugene.qp.service.exception.QuestionNotFoundException;
import com.eugene.qp.service.exception.UserNotFoundException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QuestionService {

    List<AnswerType> getAllAnswerTypes();

    QuestionDto createQuestion(QuestionDto question) throws UserNotFoundException;

    Page<QuestionDto> getUserQuestionsPaginated(long userId, int page, int size);

    void deleteQuestion(long id) throws QuestionNotFoundException;
}
